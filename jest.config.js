module.exports = {
   moduleFileExtensions: ["js", "jsx", "json"],
   transform: {
      ".+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$":
         "babel-jest",
      "^.+\\.js$": "babel-jest"
   },
   moduleNameMapper: {
      "^@/(.*)$": "<rootDir>/src/$1",
      "\\.(css|less|sass|scss)$": "<rootDir>/__mocks__/styleMock.js",
      "\\.(gif|ttf|eot|svg)$": "<rootDir>/__mocks__/fileMock.js"
   },
   transformIgnorePatterns: ["<rootDir>/node_modules/"]
}
