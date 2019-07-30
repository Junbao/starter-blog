const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  const blogPost = path.resolve(`./src/templates/post.js`)
    return graphql(
      `
        {
          allContentfulPost {
            edges {
              node {
                title
                subtitle
                description
                date
                 image {
                  fluid {
                    src
                  }
                }
                content {
                  childContentfulRichText {
                    html
                  }
                }
                slug
              }
            }
          }
        }
      `
    ).then(result => {
      if (result.errors) {
        throw result.errors
      }

      const posts = result.data.allContentfulPost.edges

      posts.forEach((post, index) => {
        const previous = index === posts.length - 1 ? null : posts[index + 1].node
        const next = index === 0 ? null : posts[index - 1].node

        createPage({
          path: post.node.slug,
          component: blogPost,

          context: {
            slug: post.node.slug,
            previous,
            next,
          },
        })
      })

    return null
  })

}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })

    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}
