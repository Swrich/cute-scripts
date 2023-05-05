const fs = require('fs');
const lockDir = './locks/';

// 检查是否有同一任务在执行
function checkLock(taskName) {
  try {
    // 尝试读取锁文件
    fs.accessSync(getLockFile(taskName), fs.constants.F_OK);
    // 锁文件存在，说明有任务在执行
    return true;
  } catch (err) {
    // 锁文件不存在，说明没有任务在执行
    return false;
  }
}

// 设置锁，避免重复执行任务
function setLock(taskName) {
  if (!fs.existsSync(lockDir)) {
    fs.mkdirSync(lockDir, { recursive: true });
  }
  fs.writeFileSync(getLockFile(taskName), '');
}

// 清除锁
function clearLock(taskName) {
  fs.unlinkSync(getLockFile(taskName));
}

// 获取锁文件路径
function getLockFile(taskName) {
  return `${lockDir}${taskName}.lock`;
}

module.exports = {
  checkLock,
  setLock,
  clearLock,
};
