module.exports = {
  client:{
    service:{
      includes:["./src/**/*.{ts,tsx}"],
      tagName:"gql",
      name:"instaclone-backend",
      url:"http://localhost:4000/graphql",
    }
  }
}
