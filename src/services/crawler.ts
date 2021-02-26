//
// 自动化截取刷卡资料
//
import {SqliteHelper} from '../services/sqlitehelper';

export class Crawler {
  static http = require('http'); // NOTE: import default module
  static fs = require('fs'); // NOTE: import default module
  static querystring = require('querystring'); // NOTE: import default module
  static sd = require('silly-datetime');
  // tslint:disable-next-line: no-any
  static CLOCK_TIME: any = [];
  // tslint:disable-next-line: no-any
  static EMPLOYEES: any = [];

  //
  // Step 1: Open login page to get cookie 'ASP.NET_SessionId' and hidden input '_ASPNetRecycleSession'.
  //

  static _ASPNetRecycleSession: string;
  static _ASPNET_SessionId: string;
  static async openLoginPage() {
    return new Promise(function (resolve, reject) {
      // tslint:disable-next-line: no-any
      const callback = (response: any) => {
        // tslint:disable-next-line: no-any
        let chunks: any = [];
        // tslint:disable-next-line: no-any
        response.addListener('data', (chunk: any) => {
          chunks.push(chunk);
        });
        response.on('end', () => {
          let buff = Buffer.concat(chunks);
          let html = buff.toString();
          if (response.statusCode === 200) {
            let fo = Crawler.fs.createWriteStream('tmp/step1-LoginPage.html');
            fo.write(html);
            fo.end();
            let cookie = response.headers['set-cookie'][0];
            let patc = new RegExp('ASP.NET_SessionId=(.*?);');
            let mc = patc.exec(cookie);
            if (mc) {
              Crawler._ASPNET_SessionId = mc[1];
              console.log(
                `Cookie ASP.NET_SessionId: ${Crawler._ASPNET_SessionId}`,
              );
            }
            let patm = new RegExp(
              '<input type="hidden" name="_ASPNetRecycleSession" id="_ASPNetRecycleSession" value="(.*?)" />',
            );
            let mm = patm.exec(html);
            if (mm) {
              Crawler._ASPNetRecycleSession = mm[1];
              console.log(
                `Element _ASPNetRecycleSession: ${Crawler._ASPNetRecycleSession}`,
              );
            }
            console.log('Step1 login page got.\n');
            Crawler.login();
          } else {
            let msg = `Step1 HTTP error: ${response.statusMessage}`;
            console.error(msg);
          }
        });
      };

      let req = Crawler.http.request(
        'http://twhratsql.whq.wistron/OGWeb/LoginForm.aspx',
        callback,
      );

      // tslint:disable-next-line: no-any
      req.on('error', (e: any) => {
        let msg = `Step1 Problem: ${e.message}`;
        console.error(msg);
      });

      req.end();
    });
  }

  //
  // Step 2: POST data to login to get cookie 'OGWeb'.
  //
  // tslint:disable-next-line: no-any
  static OGWeb: any;

  static login() {
    return new Promise(function (resolve, reject) {
      // tslint:disable-next-line: no-any
      function callback(response: any) {
        // tslint:disable-next-line: no-any
        let chunks: any = [];
        // tslint:disable-next-line: no-any
        response.addListener('data', (chunk: any) => {
          chunks.push(chunk);
        });
        response.on('end', () => {
          let buff = Buffer.concat(chunks);
          let html = buff.toString();
          if (response.statusCode === 302) {
            let fo = Crawler.fs.createWriteStream('tmp/step2-login.html');
            fo.write(html);
            fo.end();
            let cookie = response.headers['set-cookie'][0];
            let patc = new RegExp('OGWeb=(.*?);');
            let mc = patc.exec(cookie);
            if (mc) {
              Crawler.OGWeb = mc[1];
              console.log('Cookie OGWeb got.');
            }
            console.log('Step2 done.\n');
            Crawler.step3();
          } else {
            let msg = `Step2 HTTP error: ${response.statusMessage}`;
            console.error(msg);
          }
        });
      }

      let postData = Crawler.querystring.stringify({
        __ctl07_Scroll: '0,0',
        __VIEWSTATE:
          '/wEPDwULLTEyMTM0NTM5MDcPFCsAAmQUKwABZBYCAgMPFgIeBXN0eWxlBTFiZWhhdmlvcjp1cmwoL09HV2ViL3RxdWFya19jbGllbnQvZm9ybS9mb3JtLmh0Yyk7FhACCA8UKwAEZGRnaGQCCg8PFgIeDEVycm9yTWVzc2FnZQUZQWNjb3VudCBjYW4gbm90IGJlIGVtcHR5LmRkAgwPDxYCHwEFGlBhc3N3b3JkIGNhbiBub3QgYmUgZW1wdHkuZGQCDQ8PFgIeB1Zpc2libGVoZGQCDg8UKwAEZGRnaGQCEg8UKwADDxYCHgRUZXh0BSlXZWxjb21lIFRvIOe3r+WJteizh+mAmuiCoeS7veaciemZkOWFrOWPuGRkZ2QCFA8UKwADDxYCHwMFK0Jlc3QgUmVzb2x1dGlvbjoxMDI0IHggNzY4OyBJRSA2LjAgb3IgYWJvdmVkZGdkAhsPFCsAAmQoKWdTeXN0ZW0uRHJhd2luZy5Qb2ludCwgU3lzdGVtLkRyYXdpbmcsIFZlcnNpb249Mi4wLjAuMCwgQ3VsdHVyZT1uZXV0cmFsLCBQdWJsaWNLZXlUb2tlbj1iMDNmNWY3ZjExZDUwYTNhBDAsIDBkGAEFHl9fQ29udHJvbHNSZXF1aXJlUG9zdEJhY2tLZXlfXxYCBQVjdGwwNwUITG9naW5CdG6vo0TFNrmm9RKH7uSQ+NY2OXccyA==',
        __VIEWSTATEGENERATOR: 'F163E3A2',
        _PageInstance: '1',
        __EVENTVALIDATION:
          '/wEWBAK20LBAAsiTss0OArOuiN0CArmtoJkDPmmwqug37xjPhGglEwK8JU9zleg=',
        UserPassword: 'S0808001',
        UserAccount: 'S0808001',
        'LoginBtn.x': '74',
        'LoginBtn.y': '10',
        _ASPNetRecycleSession: Crawler._ASPNetRecycleSession,
      });
      //console.log(postData);
      let req = Crawler.http.request(
        {
          hostname: 'twhratsql.whq.wistron',
          path: '/OGWeb/LoginForm.aspx',
          method: 'POST',
          headers: {
            Cookie: 'ASP.NET_SessionId=' + Crawler._ASPNET_SessionId, // NOTED.
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData),
          },
        },
        callback,
      );

      // tslint:disable-next-line: no-any
      req.on('error', (e: any) => {
        let msg = `Step2 Problem: ${e.message}`;
        console.error(msg);
      });

      req.write(postData);
      req.end();
    });
  }

  //
  // Step 3: Open EntryLogQueryForm.aspx page to get hidden input '_ASPNetRecycleSession', '__VIEWSTATE' and '__EVENTVALIDATION'.
  //
  static __VIEWSTATE = '';
  static __EVENTVALIDATION = '';

  static step3() {
    return new Promise(function (resolve, reject) {
      // tslint:disable-next-line: no-any
      function callback(response: any) {
        // tslint:disable-next-line: no-any
        let chunks: any = [];
        // tslint:disable-next-line: no-any
        response.addListener('data', (chunk: any) => {
          chunks.push(chunk);
        });
        response.on('end', () => {
          let buff = Buffer.concat(chunks);
          let html = buff.toString();
          if (response.statusCode === 200) {
            let fo = Crawler.fs.createWriteStream('tmp/step3.html');
            fo.write(html);
            fo.end();
            let patm = new RegExp(
              '<input type="hidden" name="_ASPNetRecycleSession" id="_ASPNetRecycleSession" value="(.*?)" />',
            );
            let mm = patm.exec(html);
            if (mm) {
              Crawler._ASPNetRecycleSession = mm[1];
              console.log(
                `Element _ASPNetRecycleSession: ${Crawler._ASPNetRecycleSession}`,
              );
            }
            let patv = new RegExp(
              '<input type="hidden" name="__VIEWSTATE" id="__VIEWSTATE" value="(.*?)"',
            );
            let mv = patv.exec(html);
            if (mv) {
              Crawler.__VIEWSTATE = mv[1];
              console.log('Element __VIEWSTATE got');
            }
            let pate = new RegExp(
              '<input type="hidden" name="__EVENTVALIDATION" id="__EVENTVALIDATION" value="(.*?)"',
            );
            let me = pate.exec(html);
            if (me) {
              Crawler.__EVENTVALIDATION = me[1];
              console.log('Element __EVENTVALIDATION got');
            }
            console.log('Step3 done.\n');
            Crawler.askAll();
          } else {
            let msg = `Step3 HTTP error: ${response.statusMessage}`;
            console.error(msg);
          }
        });
      }

      let req = Crawler.http.request(
        {
          hostname: 'twhratsql.whq.wistron',
          path: '/OGWeb/OGWebReport/EntryLogQueryForm.aspx',
          //method: "GET",    // Default can be omitted.
          headers: {
            Cookie: `ASP.NET_SessionId=${Crawler._ASPNET_SessionId}; OGWeb=${Crawler.OGWeb}`, // important
          },
        },
        callback,
      );

      // tslint:disable-next-line: no-any
      req.on('error', (e: any) => {
        let msg = `Step3 Problem: ${e.message}`;
        console.error(msg);
      });

      req.end();
    });
  }

  //
  // Step 4: POST data to inquire.
  //
  /**
   * 截取某人的刷卡资料。
   * @param {*} beginDate 开始日期
   * @param {*} endDate 截止日期
   * @param {*} employeeIdOrName 工号或名字
   * @param {*} nextPage if go to next page
   * @param {*} nextStep 完成后调用此function
   */
  static inquire(
    beginDate: string,
    endDate: string,
    employeeIdOrName: string,
    nextPage: boolean,
    // tslint:disable-next-line: no-any
    nextStep: any,
  ) {
    // tslint:disable-next-line: no-any
    function callback(response: any) {
      // tslint:disable-next-line: no-any
      let chunks: any = [];
      // tslint:disable-next-line: no-any
      response.addListener('data', (chunk: any) => {
        chunks.push(chunk);
      });
      response.on('end', () => {
        let buff = Buffer.concat(chunks);
        let html = buff.toString();
        if (response.statusCode === 200) {
          let allDate = Crawler.getAllDate(
            Crawler.sd.format(beginDate, 'YYYY-MM-DD'),
            Crawler.sd.format(endDate, 'YYYY-MM-DD'),
          );
          let result = Crawler.parseKQ(html, allDate);

          // tslint:disable-next-line: no-any
          result.clockTimeList.forEach(function (clock: any) {
            Crawler.CLOCK_TIME.push(clock);
          });

          let fo = Crawler.fs.createWriteStream(
            `tmp/step4-inquire-${employeeIdOrName}-${result.curPage}.html`,
          );
          fo.write(html);
          fo.end();
          if (result.curPage < result.numPages) {
            Crawler.inquire(
              beginDate,
              endDate,
              employeeIdOrName,
              true,
              nextStep,
            );
          } else {
            console.log(`Inquiry about ${employeeIdOrName} is done.`);
            if (nextStep) {
              // If provided.
              nextStep();
            }
          }
        } else {
          console.error(`Inquiry HTTP error: ${response.statusMessage}`);
        }
      });
    }

    let beginTime = '0:00';
    let endTime = '23:59';

    // tslint:disable-next-line: no-any
    let postObj: any;
    if (nextPage) {
      postObj = {
        TQuarkScriptManager1: 'QueryResultUpdatePanel|QueryBtn',
        TQuarkScriptManager1_HiddenField:
          ';;AjaxControlToolkit, Version=1.0.20229.20821, Culture=neutral, PublicKeyToken=28f01b0e84b6d53e:en-US:c5c982cc-4942-4683-9b48-c2c58277700f:411fea1c:865923e8;;AjaxControlToolkit, Version=1.0.20229.20821, Culture=neutral, PublicKeyToken=28f01b0e84b6d53e:en-US:c5c982cc-4942-4683-9b48-c2c58277700f:91bd373d:d7d5263e:f8df1b50;;AjaxControlToolkit, Version=1.0.20229.20821, Culture=neutral, PublicKeyToken=28f01b0e84b6d53e:en-US:c5c982cc-4942-4683-9b48-c2c58277700f:e7c87f07:bbfda34c:30a78ec5;;AjaxControlToolkit, Version=1.0.20229.20821, Culture=neutral, PublicKeyToken=28f01b0e84b6d53e:en-US:c5c982cc-4942-4683-9b48-c2c58277700f:9b7907bc:9349f837:d4245214;;AjaxControlToolkit, Version=1.0.20229.20821, Culture=neutral, PublicKeyToken=28f01b0e84b6d53e:en-US:c5c982cc-4942-4683-9b48-c2c58277700f:e3d6b3ac;',
        __ctl07_Scroll: '0,0',
        __VIEWSTATEGENERATOR: 'A21EDEFC',
        _ASPNetRecycleSession: Crawler._ASPNetRecycleSession,
        __VIEWSTATE: Crawler.__VIEWSTATE,
        _PageInstance: 26,
        __EVENTVALIDATION: Crawler.__EVENTVALIDATION,
        AttNoNameCtrl1$InputTB: '上海欽江路',
        BeginDateTB$Editor: beginDate,
        BeginDateTB$_TimeEdit: beginTime,
        EndDateTB$Editor: endDate,
        EndDateTB$_TimeEdit: endTime,
        EmpNoNameCtrl1$InputTB: employeeIdOrName,
        GridPageNavigator1$NextBtn: 'Next Page',
      };
    } else {
      postObj = {
        TQuarkScriptManager1: 'QueryResultUpdatePanel|QueryBtn',
        TQuarkScriptManager1_HiddenField:
          ';;AjaxControlToolkit, Version=1.0.20229.20821, Culture=neutral, PublicKeyToken=28f01b0e84b6d53e:en-US:c5c982cc-4942-4683-9b48-c2c58277700f:411fea1c:865923e8;;AjaxControlToolkit, Version=1.0.20229.20821, Culture=neutral, PublicKeyToken=28f01b0e84b6d53e:en-US:c5c982cc-4942-4683-9b48-c2c58277700f:91bd373d:d7d5263e:f8df1b50;;AjaxControlToolkit, Version=1.0.20229.20821, Culture=neutral, PublicKeyToken=28f01b0e84b6d53e:en-US:c5c982cc-4942-4683-9b48-c2c58277700f:e7c87f07:bbfda34c:30a78ec5;;AjaxControlToolkit, Version=1.0.20229.20821, Culture=neutral, PublicKeyToken=28f01b0e84b6d53e:en-US:c5c982cc-4942-4683-9b48-c2c58277700f:9b7907bc:9349f837:d4245214;;AjaxControlToolkit, Version=1.0.20229.20821, Culture=neutral, PublicKeyToken=28f01b0e84b6d53e:en-US:c5c982cc-4942-4683-9b48-c2c58277700f:e3d6b3ac;',
        __ctl07_Scroll: '0,0',
        __VIEWSTATEGENERATOR: 'A21EDEFC',
        _ASPNetRecycleSession: Crawler._ASPNetRecycleSession,
        __VIEWSTATE: Crawler.__VIEWSTATE,
        _PageInstance: 26,
        __EVENTVALIDATION: Crawler.__EVENTVALIDATION,
        AttNoNameCtrl1$InputTB: '上海欽江路',
        BeginDateTB$Editor: beginDate,
        BeginDateTB$_TimeEdit: beginTime,
        EndDateTB$Editor: endDate,
        EndDateTB$_TimeEdit: endTime,
        EmpNoNameCtrl1$InputTB: employeeIdOrName,
        QueryBtn: 'Inquire',
      };
    }

    let postData = Crawler.querystring.stringify(postObj);

    let req = Crawler.http.request(
      {
        hostname: 'twhratsql.whq.wistron',
        path: '/OGWeb/OGWebReport/EntryLogQueryForm.aspx',
        method: 'POST',
        headers: {
          'User-Agent':
            'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; MAARJS)', // mimic IE 11 // important
          'X-MicrosoftAjax': 'Delta=true', // important
          Cookie: `ASP.NET_SessionId=${Crawler._ASPNET_SessionId}; OGWeb=${Crawler.OGWeb}`, // important
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(postData),
        },
      },
      callback,
    );

    // tslint:disable-next-line: no-any
    req.on('error', (e: any) => {
      console.error(`Step4 Problem: ${e.message}`);
    });

    req.end(postData);
  }

  /**
   * Parse the input html to get 刷卡 data.
   * @param {*} html
   * @return number of current page and number of total pages.
   */
  // tslint:disable-next-line: no-any
  static parseKQ(html: string, allDate: any) {
    // Get number of pages.
    let curPage = 1;
    let numPages = 1;
    let rexTotal = new RegExp(
      '<span id="GridPageNavigator1_CurrentPageLB">(.*?)</span>[^]*?<span id="GridPageNavigator1_TotalPageLB">(.*?)</span>',
    );
    let match = rexTotal.exec(html);
    if (match) {
      curPage = parseInt(match[1]);
      numPages = parseInt(match[2]);
      console.log(`Page: ${curPage} / ${numPages}`);
    }

    // Update __VIEWSTATE __EVENTVALIDATION
    let rexVS = new RegExp('__VIEWSTATE[|](.*?)[|]');
    let matVS = rexVS.exec(html);
    if (matVS) {
      Crawler.__VIEWSTATE = matVS[1];
    }
    let rexEV = new RegExp('__EVENTVALIDATION[|](.*?)[|]');
    let matEV = rexEV.exec(html);
    if (matEV) {
      Crawler.__EVENTVALIDATION = matEV[1];
    }

    let clockTimeList = [];
    // Print 刷卡 data
    //console.log(`/Department  /EID  /Name  /Clock Time`);
    while (true) {
      let rex = new RegExp(
        '<td>(.*?)</td><td>&nbsp;</td><td><.*?>(.*?)</a></td><td>(.*?)</td><td>.*?</td><td>(.*?)</td>',
        'g',
      ); // NOTE: 'g' is important
      let m = rex.exec(html);
      if (m) {
        let clock = {
          department: `${m[1]}`,
          employee_id: `${m[2]}`,
          name: `${m[3]}`,
          clock_time: `${Crawler.sd.format(m[4], 'YYYY-MM-DD HH:mm:ss')}`,
        };
        clockTimeList.push(clock);

        let i = 0;
        for (i = 0; i < allDate.length; i++) {
          if (
            !Crawler.EMPLOYEES.includes(
              `<data>${m[1]}</data><data>${m[2]}</data><data>${
                m[3]
              }</data><data>${Crawler.sd.format(
                allDate[i],
                'YYYY-MM-DD',
              )}</data>`,
            )
          ) {
            Crawler.EMPLOYEES.push(
              `<data>${m[1]}</data><data>${m[2]}</data><data>${
                m[3]
              }</data><data>${Crawler.sd.format(
                allDate[i],
                'YYYY-MM-DD',
              )}</data>`,
            );
          }
        }

        //console.log(`${m[1]} ${m[2]} ${m[3]} ${m[4]}`);
        html = html.substr(rex.lastIndex);
      } else {
        break;
      }
    }
    return {
      curPage: curPage,
      numPages: numPages,
      clockTimeList: clockTimeList,
    };
  }

  static promiseInquire = (
    beginDate: string,
    endDate: string,
    employeeIdOrName: string,
    // tslint:disable-next-line: no-any
    nextPage: any,
  ) => {
    return new Promise((resolve, reject) => {
      Crawler.inquire(
        beginDate,
        endDate,
        employeeIdOrName,
        nextPage,
        // tslint:disable-next-line: no-any
        (err: string, data: any) => {
          if (err) {
            return reject(err);
          }
          resolve(data);
        },
      );
    });
  };

  static getAllDate(sDate: string, eDate: string) {
    let allDate = new Array();
    let i = 0;
    while (sDate <= eDate) {
      allDate[i] = sDate;
      let sDate_ts = new Date(sDate).getTime();
      let nextDate = sDate_ts + 24 * 60 * 60 * 1000;
      let nextDateYear = new Date(nextDate).getFullYear() + '-';
      let nextDateMonth =
        new Date(nextDate).getMonth() + 1 < 10
          ? '0' + (new Date(nextDate).getMonth() + 1) + '-'
          : new Date(nextDate).getMonth() + 1 + '-';
      let nextDateDay =
        new Date(nextDate).getDate() < 10
          ? '0' + new Date(nextDate).getDate()
          : new Date(nextDate).getDate();
      sDate = nextDateYear + nextDateMonth + nextDateDay;
      i++;
    }
    return allDate;
  }

  static askAll() {
    SqliteHelper.getInqEmployeeList()
      // tslint:disable-next-line: no-any
      .then(async function (data: any) {
        let employees = JSON.parse(data);
        let i = 0;
        for (i = 0; i < employees.length; i++) {
          await Crawler.promiseInquire(
            `${employees[i].inq_start_t}`,
            `${employees[i].inq_end_t}`,
            `${employees[i].employeeIdOrName}`,
            false,
          );
        }
      })
      .then(function () {
        SqliteHelper.getConn(Crawler.CLOCK_TIME, Crawler.EMPLOYEES)
          .then(SqliteHelper.openDb)
          .then(SqliteHelper.createSchema)
          .then(SqliteHelper.calculateClockData);
      });
  }
}
