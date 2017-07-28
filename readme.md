# More Better Collective 

An ongoing project for the More Better Collective Team.

Project specific docs coming soon.

This is a fork of [Tachyons](https://github.com/tachyons-css/tachyons) with values being 
configurable in a single variables file. More information about Tachyons can be found at http://tachyons.io

## Getting started

Docs can be found at http://tachyons.io/docs
The modules are generally pretty small and thus easy to read and grock if you're familiar with css at all.

#### Build

If you want to just use src as a jumping off point and edit all the code yourself, you can compile all of your wonderful changes by running

```npm start```

This will output both minified and unminified versions of the css to the css directory.

If you want to recompile everything from src everytime you save a change - you can run the following command, which will compile and minify the css

```npm run build:watch```

If you want to check that a class hasn't been redefined or 'mutated' there is a linter to check that all of the classes have only been defined once. This can be useful if you are using another library or have written some of your own css and want to make sure there are no naming collisions. To do this run the command

```npm run mutations```

## License

MIT
