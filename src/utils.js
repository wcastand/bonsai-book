const path = require('path')
const fs = require('fs')
const shortid = require('shortid')

const conf_path = path.resolve(process.cwd(), '../bonsai.config.js')
const config = fs.existsSync(conf_path)
  ? require(conf_path)
  : {
      stories_dir: './stories',
      output_dir: './output',
    }

const getSubTree = () => {
  const stories = []
  const traverse = last_dir => f => {
    const id = shortid.generate()
    const p = path.resolve(last_dir, f)
    const ext = path.extname(f)
    const rp = '/' + path.relative(config.stories_dir, p).replace(ext, '')
    const s = fs.lstatSync(p)
    const name = f.replace(ext, '')
    const isDir = s.isDirectory()
    stories.push({
      id,
      name,
      path: rp,
      isDir,
      ...(!isDir && { src: fs.readFileSync(p, 'UTF-8') }),
    })
    return isDir ? [id, fs.readdirSync(p).map(traverse(p))] : id
  }

  const subTree = fs.readdirSync(config.stories_dir)
  const tree = subTree.map(traverse(config.stories_dir))
  return { tree, stories }
}

module.exports = {
  getSubTree,
}
