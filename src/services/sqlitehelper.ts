export class SqliteHelper {
  static fs = require("fs");
  static sqlite3 = require("sqlite3");
  // tslint:disable-next-line: no-any
  static db: any;
  static UUID = require("uuid");
  static _BATCHID = SqliteHelper.UUID.v1();
  // tslint:disable-next-line: no-any
  static _CLOCK_TIME: any[] = [];
  // tslint:disable-next-line: no-any
  static _EMPLOYEES: any[] = [];

  static getConn = function(clocks: Array<string>, employees: Array<string>) {
    return new Promise(function(resolve, reject) {
      // tslint:disable-next-line: no-any
      SqliteHelper.fs.readFile("conn.txt", "utf-8", function(
        // tslint:disable-next-line: no-any
        err: any,
        data: string
      ) {
        if (err) {
          reject(err);
        } else {
          console.log("db: ".concat(data));
          resolve(data.trim());
          SqliteHelper._CLOCK_TIME = clocks;
          SqliteHelper._EMPLOYEES = employees;
        }
      });
    });
  };

  // tslint:disable-next-line: no-any
  static openDb = function(dbConn: any) {
    return new Promise(function(resolve, reject) {
      // tslint:disable-next-line: no-any
      SqliteHelper.db = new SqliteHelper.sqlite3.Database(dbConn, function(
        // tslint:disable-next-line: no-any
        err: any
      ) {
        if (err) {
          reject(err);
        } else {
          console.log("open database");
          resolve(0);
        }
      });
    });
  };

  static getDayOfWeek = function(theDate: string) {
    let dayOfWeek = new Date(theDate).getDay();
    let day;
    switch (dayOfWeek) {
      case 0:
        day = "Sunday";
        break;
      case 1:
        day = "Monday";
        break;
      case 2:
        day = "Tuesday";
        break;
      case 3:
        day = "Wednesday";
        break;
      case 4:
        day = "Thursday";
        break;
      case 5:
        day = "Friday";
        break;
      case 6:
        day = "Saturday";
        break;
      default:
        break;
    }
    return day;
  };

  static createSchema = function() {
    return new Promise(function(resolve, reject) {
      SqliteHelper.db.serialize(function() {
        let dropEpmloyeeTable = "DROP TABLE IF EXISTS kq_employee";
        let createEpmloyeeTable =
          "CREATE TABLE IF NOT EXISTS kq_employee ('batchid' NVARCHAR(50), 'department' NVARCHAR(20), 'employee_id' NVARCHAR(15), 'employee_name' NVARCHAR(50), 'clock_date' DATE, 'day_of_week' NVARCHAR(20))";
        let createClockTable =
          "CREATE TABLE IF NOT EXISTS kq_clock_time ('batchid' NVARCHAR(50), 'department'  NVARCHAR(20), 'employee_id' NVARCHAR(15), 'employee_name' NVARCHAR(50), 'clock_time' DATETIME)";
        let createReportTable =
          "CREATE TABLE IF NOT EXISTS kq_clock_report ('batchid' NVARCHAR(50), 'department' NVARCHAR(20), 'employee_id' NVARCHAR(15), 'employee_name' NVARCHAR(50), 'clock_date' DATE, 'day_of_week' NVARCHAR(20), 'clock_in_t' DATETIME, 'clock_out_t' DATETIME, 'work_hour' INT, 'status' NVARCHAR(20),'stipulate_in_t' DATETIME,'stipulate_out_t' DATETIME,'create_t' DATETIME)";

        // tslint:disable-next-line: no-any
        SqliteHelper.db.exec(dropEpmloyeeTable, function(err: any, data: any) {
          if (err) {
            reject(err);
          } else {
            console.log("drop table kq_employee");
          }
        });

        // tslint:disable-next-line: no-any
        SqliteHelper.db.exec(createEpmloyeeTable, function(err: any) {
          if (err) {
            reject(err);
          } else {
            console.log("create table kq_employee");
            SqliteHelper._EMPLOYEES.forEach(function(employee) {
              let rex = new RegExp(
                "<data>(.*?)</data><data>(.*?)</data><data>(.*?)</data><data>(.*?)</data>",
                "g"
              ); // NOTE: 'g' is important
              let m = rex.exec(employee);
              if (m) {
                SqliteHelper.db.run(
                  "insert into kq_employee(batchid,department,employee_id,employee_name,clock_date,day_of_week) VALUES ( $batchid,  $department,  $employee_id,  $employee_name, $clock_date, $day_of_week)",
                  {
                    $batchid: SqliteHelper._BATCHID,
                    $department: m[1],
                    $employee_id: m[2],
                    $employee_name: m[3],
                    $clock_date: m[4],
                    $day_of_week: SqliteHelper.getDayOfWeek(m[4]),
                  },
                  // tslint:disable-next-line: no-any
                  function(err1: any, data: any) {
                    if (err1) {
                      reject(err1);
                    } else {
                      //console.log("成功插入1笔kq_employee记录");
                    }
                  }
                );
              }
            });
            console.log("init kq_employee data");
          }
        });

        // tslint:disable-next-line: no-any
        SqliteHelper.db.exec(createClockTable, function(err: any) {
          if (err) {
            reject(err);
          } else {
            console.log("create table kq_clock_time");
            SqliteHelper._CLOCK_TIME.forEach(function(clock) {
              SqliteHelper.db.run(
                "insert into kq_clock_time(batchid,department,employee_id,employee_name,clock_time) VALUES ($batchid, $department, $employee_id, $employee_name, $clock_time)",
                {
                  $batchid: SqliteHelper._BATCHID,
                  $department: clock.department,
                  $employee_id: clock.employee_id,
                  $employee_name: clock.name,
                  $clock_time: clock.clock_time,
                },
                // tslint:disable-next-line: no-any
                function(err2: any, data: any) {
                  if (err2) {
                    reject(err2);
                  } else {
                    //console.log("成功插入1笔kq_clock_time记录");
                  }
                }
              );
            });
            console.log("init kq_clock_time data");
          }
        });

        // tslint:disable-next-line: no-any
        SqliteHelper.db.exec(createReportTable, function(err: any, data: any) {
          if (err) {
            reject(err);
          } else {
            console.log("create table kq_clock_report");
            SqliteHelper.db.run(
              `insert into kq_clock_report (batchid,department,employee_id,employee_name,clock_date,day_of_week,stipulate_in_t,stipulate_out_t,create_t)	
                    select batchid,department,employee_id,employee_name,clock_date,day_of_week,strftime('%Y-%m-%d 08:50:59',clock_date,'localtime'),strftime('%Y-%m-%d 16:50:00',clock_date,'localtime'),datetime('now', 'localtime') from kq_employee ke WHERE batchid=$batchid`,
              {
                $batchid: SqliteHelper._BATCHID,
              },
              // tslint:disable-next-line: no-any
              function(err3: any, data3: any) {
                if (err3) {
                  reject(err3);
                } else {
                  //console.log("成功插入1笔kq_clock_report记录");
                }
              }
            );
            console.log("init kq_clock_report data");
            resolve(SqliteHelper._BATCHID);
          }
        });
      });
    });
  };

  // tslint:disable-next-line: no-any
  static calculateClockData = function(batchid: any) {
    return new Promise(function(resolve, reject) {
      SqliteHelper.db.serialize(function() {
        //clock_date分组，clock_time排序，每组取第一个作为clock_time_start
        let insertStartData = `
          UPDATE kq_clock_report 
          SET clock_in_t = (
            SELECT clock_time FROM(
              SELECT batchid,department,employee_id,employee_name,clock_date,clock_time,datetime('now', 'localtime') FROM(
                SELECT SUBSTR(clock_time,0,INSTR(clock_time,' ')) AS clock_date,batchid,department,employee_id,employee_name,clock_time
                  ,ROW_NUMBER() OVER(PARTITION BY SUBSTR(clock_time,0,INSTR(clock_time,' ')),batchid,department,employee_id,employee_name ORDER BY clock_time) AS RN
                FROM [kq_clock_time]
                WHERE batchid='${batchid}'
              ) T
              WHERE RN=1 	
            )T3
            WHERE T3.batchid=kq_clock_report.batchid AND T3.department=kq_clock_report.department 
              AND T3.employee_id=kq_clock_report.employee_id AND T3.employee_name=kq_clock_report.employee_name 
              AND T3.clock_date=kq_clock_report.clock_date
          )
          WHERE batchid='${batchid}'  
        `;
        //clock_date分组，clock_time排序，每组取最后一个作为clock_time_end
        let updateEndData = `
          UPDATE kq_clock_report 
          SET clock_out_t = (
            SELECT clock_time FROM(
              SELECT batchid,department,employee_id,employee_name,clock_date,clock_time,RN,RN_MAX
              FROM(
                SELECT 
                  batchid,department,employee_id,employee_name,clock_date,clock_time,RN
                  ,ROW_NUMBER() OVER(PARTITION BY clock_date,batchid,department,employee_id,employee_name ORDER BY RN DESC) AS RN_MAX
                FROM(
                  SELECT SUBSTR(clock_time,0,INSTR(clock_time,' ')) AS clock_date,batchid,department,employee_id,employee_name,clock_time
                  ,ROW_NUMBER() OVER(PARTITION BY SUBSTR(clock_time,0,INSTR(clock_time,' ')),batchid,department,employee_id,employee_name ORDER BY clock_time) AS RN
                  FROM [kq_clock_time]
                  WHERE batchid='${batchid}'
                ) T1
              ) T2
              WHERE T2.RN_MAX=1		
            )T3
            WHERE T3.batchid=kq_clock_report.batchid AND T3.department=kq_clock_report.department 
              AND T3.employee_id=kq_clock_report.employee_id AND T3.employee_name=kq_clock_report.employee_name 
              AND T3.clock_date=kq_clock_report.clock_date
          )
          WHERE batchid='${batchid}'         
        `;
        //更新work_hour
        let updateWorkHour = `
          UPDATE kq_clock_report
          SET work_hour=CASE WHEN clock_in_t IS NOT NULL AND clock_out_t IS NOT NULL
                      THEN (julianday(clock_out_t) - julianday(clock_in_t))*24 
                    ELSE 0
                END
          WHERE BatchID='${batchid}' 
        `;
        //更新Status
        let updateStatus = `
          UPDATE kq_clock_report
          SET status=CASE WHEN clock_date > create_t THEN '未發生'
                  WHEN day_of_week in ('Saturday','Sunday') AND work_hour > 0 THEN '週末加班'
                  WHEN day_of_week in ('Saturday','Sunday') AND work_hour = 0 THEN '週末'
                  WHEN strftime('%m-%d',clock_date,'localtime')='01-01' THEN '元旦'
                  WHEN strftime('%m-%d',clock_date,'localtime')='05-01' THEN '勞動節'
                  WHEN strftime('%m-%d',clock_date,'localtime') in('10-01','10-02','10-03') THEN '國慶節'
                  WHEN clock_in_t IS NULL AND clock_out_t IS NULL THEN '請假'
                  WHEN clock_in_t IS NOT NULL AND clock_in_t > stipulate_in_t AND (clock_in_t = clock_out_t) THEN '遲到 只刷一次'
                  WHEN clock_in_t IS NULL AND clock_out_t IS NOT NULL AND clock_out_t < stipulate_out_t THEN '早退 只刷一次'
                  WHEN clock_in_t IS NULL OR clock_out_t IS NULL OR (clock_in_t = clock_out_t) THEN '只刷一次'
                  WHEN clock_in_t IS NOT NULL AND clock_out_t IS NOT NULL
                    THEN (
                      CASE 
                        WHEN (clock_in_t > stipulate_in_t) AND (clock_out_t > stipulate_in_t AND clock_out_t < stipulate_out_t AND clock_in_t <> clock_out_t) AND (work_hour < 9) THEN '遲到 早退 工時不足' 
                        WHEN (clock_in_t > stipulate_in_t) AND (clock_out_t > stipulate_in_t AND clock_out_t < stipulate_out_t AND clock_in_t <> clock_out_t) THEN '遲到 早退'
                        WHEN (clock_in_t > stipulate_in_t) AND (work_hour < 9) THEN '遲到 工時不足'
                        WHEN (clock_out_t > stipulate_in_t AND clock_out_t < stipulate_out_t AND clock_in_t <> clock_out_t) AND (work_hour < 9) THEN '早退 工時不足'
                        WHEN clock_in_t > stipulate_in_t THEN '遲到' 
                          WHEN clock_out_t > stipulate_in_t AND clock_out_t < stipulate_out_t AND clock_in_t <> clock_out_t THEN '早退'
                          WHEN work_hour < 9 THEN '工時不足'
                          ELSE '正常'
                      END
                    )
                  ELSE '正常'
                END
          WHERE BatchID='${batchid}'      
        `;

        // tslint:disable-next-line: no-any
        SqliteHelper.db.run(insertStartData, function(err: any) {
          if (err) {
            reject(err);
          } else {
            console.log("update in data");
          }
        });

        // tslint:disable-next-line: no-any
        SqliteHelper.db.run(updateEndData, function(err: any) {
          if (err) {
            reject(err);
          } else {
            console.log("update out data");
          }
        });

        // tslint:disable-next-line: no-any
        SqliteHelper.db.run(updateWorkHour, function(err: any) {
          if (err) {
            reject(err);
          } else {
            console.log("update work hour");
          }
        });

        // tslint:disable-next-line: no-any
        SqliteHelper.db.run(updateStatus, function(err: any) {
          if (err) {
            reject(err);
          } else {
            console.log("update status");
            resolve(batchid);
          }
        });
      });
    });
  };

  static getInqEmployeeList = function() {
    return new Promise(function(resolve, reject) {
      // tslint:disable-next-line: no-any
      SqliteHelper.fs.readFile("employee.txt", "utf-8", function(
        // tslint:disable-next-line: no-any
        err: any,
        // tslint:disable-next-line: no-any
        data: any
      ) {
        if (err) {
          reject(err);
        } else {
          console.log("employee list got");
          resolve(data.trim());
        }
      });
    });
  };
}
