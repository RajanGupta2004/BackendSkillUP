# to create tsconfig file use command

npx tsc -init

# un comment

"rootDir": "./src",
"outDir": "./dist",
"strict": true,
"lib": ["ES6"],

# need to add this

"include": ["src/**/*"],
"exclude": ["node_module"]

    "dev": "ts-node src/server.ts"
