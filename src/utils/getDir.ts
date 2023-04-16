import * as fs from 'fs-extra'
import * as path from 'path'
import homedir from './homedir'
export async function getConfig() {
  // 1、先获取是本地home目录
  const configPath = path.resolve(homedir, './.cargorc.yaml')
  const rs = fs.ensureFileSync(configPath)
  console.log('rs', configPath)
}