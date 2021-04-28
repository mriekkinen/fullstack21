const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return undefined

  const reducer = (favorite, blog) => {
    return blog.likes > favorite.likes ? blog : favorite
  }

  const favoriteBlog = blogs.reduce(reducer)
  return {
    title: favoriteBlog.title,
    author: favoriteBlog.author,
    likes: favoriteBlog.likes
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return undefined

  const counts = _.countBy(blogs, 'author')
  const author = _.maxBy(_.toPairs(counts), _.last)
  return {
    author: _.first(author),
    blogs: _.last(author)
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return undefined

  const byAuthor = _.groupBy(blogs, 'author')
  const likes = _.mapValues(byAuthor, list => _.sumBy(list, 'likes'))
  const mostLiked = _.maxBy(_.toPairs(likes), _.last)
  return {
    author: _.first(mostLiked),
    likes: _.last(mostLiked)
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
