const cron = require('node-cron');
const { exec } = require('child_process');
const fs = require('fs');
const { checkLock, setLock, clearLock } = require('./utils/taskLock.cjs');

const taskList = [];

// 读取配置文件
const config = JSON.parse(fs.readFileSync('scripts.json', 'utf8'));

const execTask = (filename) => {
  console.log(`Running script ${filename}...`);
  // 使用child_process模块执行脚本
  exec(`bash ./shell/${filename}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  });
};

// 循环遍历配置文件中的脚本和cron表达式
config.forEach(({ cron: cronExpression, script: scriptPath, immdiate }) => {
  const taskName = `!!${scriptPath}!!`;

  if (immdiate) {
    execTask(scriptPath)
  }
  if (checkLock(taskName)) {
    // 如果有同一任务在执行，则不再执行
    console.log(`${taskName} is running, skip this time.`);
    return;
  }
  // 设置锁，避免重复执行任务
  setLock(taskName);
  // 使用cron模块定时执行脚本
  cron.schedule(cronExpression, () => {
    execTask(scriptPath);
    // 清除锁
    clearLock(taskName);
  });
});
