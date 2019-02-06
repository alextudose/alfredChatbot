export class Logger {
  constructor(private saveLog: any) {
    this.saveLog = saveLog;
  }

  info(msg: string) {
    this.saveLog(msg);
  }

  error(err: any) {
    this.saveLog(JSON.stringify(err, null, 2)); 
  }
}

export function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}