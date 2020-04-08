module.exports = function(grunt){
	var gc = {
		fontVersion: '1.0.0',
		normalize: function(path){
			const regex = /\\+/g,
				subst = `/`;
			return path.replace(regex, subst);
		},
		assets: 'assets/templates/site',
		path: 'assets/templates/site'
	};
	const fs = require('fs'),
		chalk = require('chalk'),
		uniqid = function () {
			var md5 = require('md5');
			result = md5((new Date()).getTime()).toString();
			grunt.verbose.writeln("Generate hash: " + chalk.cyan(result) + " >>> OK");
			return result;
		};
	require('load-grunt-tasks')(grunt);
	require('time-grunt')(grunt);
	
	grunt.initConfig({
		globalConfig : gc,
		pkg : grunt.file.readJSON('package.json'),
		webfont: {
			icons: {
				src: 'src/glyph/*.svg',
				dest: 'src/fonts',
				options: {
					hashes: true,
					relativeFontPath: '@{fontpath}',
					destLess: 'src/less',
					font: 'IconsSite',
					types: 'ttf,eot,woff,woff2',
					fontFamilyName: 'IconsSite',
					stylesheets: ['less'],
					syntax: 'bootstrap',
					execMaxBuffer: 1024 * 400,
					htmlDemo: false,
					version: gc.fontVers,
					normalize: true,
					startCodepoint: 0xE900,
					iconsStyles: false,
					templateOptions: {
						baseClass: '',
						classPrefix: 'icon-'
					},
					embed: false,
					template: 'src/font-build.template'
				}
			},
		},
		less: {
			main: {
				options: {
					paths: ['./bower_components', './src/less', './bower_components/jquery-ui/themes/base'],
					compress: false,
					ieCompat: false,
					plugins: [
						new (require('less-plugin-autoprefix'))({browsers: ["last 4 versions"]}),
					],
					modifyVars: {
						hashes: '\'' + uniqid() + '\'',
						fontpath: '/<%= globalConfig.path %>/fonts',
						imgpath: '/<%= globalConfig.path %>/images'
					}
				},
				files: {
					'<%= globalConfig.assets %>/css/main.css': [
						'src/less/main.less'
					]
				}
			}
		},
		group_css_media_queries: {
			group: {
				files: {
					'<%= globalConfig.assets %>/css/main.css': ['<%= globalConfig.assets %>/css/main.css']
				}
			}
		},
		replace: {
			dist: {
				options: {
					patterns: [
						{
							match: /\/\* *(.*?) *\*\//g,
							replacement: ' '
						}
					]
				},
				files: {
					'<%= globalConfig.assets %>/css/main.css': '<%= globalConfig.assets %>/css/main.css'
				}
			}
		},
		cssmin: {
			options: {
				mergeIntoShorthands: false,
				roundingPrecision: -1
			},
			minify: {
				files: {
					'<%= globalConfig.assets %>/css/main.css' : ['<%= globalConfig.assets %>/css/main.css'],
				}
			}
		},
		requirejs: {
			ui: {
				options: {
					baseUrl: __dirname+"/bower_components/jquery-ui/ui/widgets/",//"./",
					paths: {
						jquery: __dirname+'/bower_components/jquery/dist/jquery'
					},
					preserveLicenseComments: false,
					optimize: "uglify",
					findNestedDependencies: true,
					skipModuleInsertion: true,
					exclude: ["jquery"],
					include: [ 
						"../disable-selection.js",
						"sortable.js",
					],
					out: "tests/js/jquery.ui.js",
					done: function(done, output) {
						grunt.log.writeln(output.magenta);
						grunt.log.writeln("jQueryUI Custom Build ".cyan + "done!\n");
						done();
					},
					error: function(done, err) {
						grunt.log.warn(err);
						done();
					}
				}
			}
		},
		uglify : {
			options: {
				ASCIIOnly: true,
				//beautify: true
			},
			main: {
				files: {
					'<%= globalConfig.assets %>/js/main.js': [
						'bower_components/jquery/dist/jquery.js',
						//'tests/js/jquery.ui.js',
						//'bower_components/fancybox/dist/jquery.fancybox.js',
						"bower_components/fancybox/src/js/core.js",
						'src/js/fancybox.default-options.js',
					    "bower_components/fancybox/src/js/media.js",
						"bower_components/fancybox/src/js/guestures.js",
					    "bower_components/fancybox/src/js/slideshow.js",
					    "bower_components/fancybox/src/js/fullscreen.js",
					    "bower_components/fancybox/src/js/thumbs.js",
					    "bower_components/fancybox/src/js/hash.js",
					    "bower_components/fancybox/src/js/wheel.js",
						'bower_components/js-cookie/src/js.cookie.js',
						//'bower_components/slick-carousel/slick/slick.js',
						//'bower_components/Croppie/croppie.js',
						//'bower_components/placeholder.js/dist/placeholder.js',
						//'src/js/prism.js',
						'src/js/main.js'
					]
				}
			}
		},
		imagemin: {
			options: {
				optimizationLevel: 3,
				svgoPlugins: [
					{
						removeViewBox: false
					}
				]
			},
			base: {
				files: [
					{
						expand: true,
						cwd: 'src/images', 
						src: ['**/*.{png,jpg,jpeg}'],
						dest: 'test/images/',
						//filter: 'isFile'
					},
					{
						expand: true,
						cwd: 'src/images', 
						src: ['**/*.{gif,svg}'],
						dest: '<%= globalConfig.assets %>/images/'
					}
				]
			}
		},
		tinyimg: {
			dynamic: {
				files: [
					{
						expand: true,
						cwd: 'test/images', 
						src: ['**/*.{png,jpg,jpeg}'],
						dest: '<%= globalConfig.assets %>/images/'
					}
				]
			}
		},
		ttf2eot: {
			default: {
				src: 'src/fonts/*.ttf',
				dest: '<%= globalConfig.assets %>/fonts/'
			}
		},
		ttf2woff: {
			default: {
				src: 'src/fonts/*.ttf',
				dest: '<%= globalConfig.assets %>/fonts/'
			}
		},
		ttf2woff2: {
			default: {
				src: 'src/fonts/*.ttf',
				dest: '<%= globalConfig.assets %>/fonts/'
			}
		},
		copy: {
			fonts: {
				expand: true,
				cwd: 'src/fonts',
				src: [
					'**.ttf'
				],
				dest: '<%= globalConfig.assets %>/fonts/',
			},
		},
		pug: {
			serv: {
				options: {
					client: false,
					pretty: '\t',
					separator:  '\n',
					data: function(dest, src) {
						return {
							"base"		: "[(site_url)]",
							"site_name"	: "[(site_name)]",
							"hash"		: uniqid(),
							"hash_css"	: uniqid(),
							"hash_js"	: uniqid(),
							"hash_appjs": uniqid(),
							"assets"	: gc.path
						}
					}
				},
				files: [
					{
						expand: true,
						cwd: 'src/pug/',
						src: [ '*.pug' ],
						dest: '<%= globalConfig.assets %>',
						ext: '.html'
					}
				]
			},
			tpl: {
				options: {
					client: false,
					pretty: '\t',
					separator:  '\n',
					data: function(dest, src) {
						return {
							"base"		: "[(site_url)]",
							"site_name"	: "[(site_name)]",
							"hash"		: uniqid(),
							"hash_css"	: uniqid(),
							"hash_js"	: uniqid(),
							"hash_appjs": uniqid(),
							"assets"	: gc.path
						}
					}
				},
				files: [
					{
						expand: true,
						cwd: 'src/pug/tpl/',
						src: [ '*.pug' ],
						dest: '<%= globalConfig.assets %>/tpl',
						ext: '.html'
					}
				]
			}
		},
		realFavicon: {
			favicons: {
				src: '<%= globalConfig.assets %>/images/3dhuman.png',
				dest: 'docs/',
				options: {
					iconsPath: '/',
					html: [],
					design: {
						ios: {
							pictureAspect: 'backgroundAndMargin',
							backgroundColor: '#ffffff',
							margin: '14%',
							assets: {
								ios6AndPriorIcons: true,
								ios7AndLaterIcons: true,
								precomposedIcons: false,
								declareOnlyDefaultIcon: true
							}
						},
						desktopBrowser: {
							design: 'raw'
						},
						windows: {
							pictureAspect: 'noChange',
							backgroundColor: '#ffffff',
							onConflict: 'override',
							assets: {
								windows80Ie10Tile: true,
								windows10Ie11EdgeTiles: {
									small: true,
									medium: true,
									big: true,
									rectangle: true
								}
							}
						},
						androidChrome: {
							pictureAspect: 'noChange',
							themeColor: '#ffffff',
							manifest: {
								display: 'browser',
								orientation: 'notSet',
								onConflict: 'override',
								declared: true
							},
							assets: {
								legacyIcon: false,
								lowResolutionIcons: false
							}
						},
						safariPinnedTab: {
							pictureAspect: 'silhouette',
							themeColor: '#00c7ff'
						}
					},
					settings: {
						scalingAlgorithm: 'Mitchell',
						errorOnImageTooSmall: false,
						readmeFile: false,
						htmlCodeFile: true,//true
						usePathAsIs: false
					}
				}
			}
		},
		connect: {
			server: {
				options: {
					base: './docs',
					hostname: "projectsoft",
					protocol: 'http', // or 'http2'
					port: 9000,
					open: 'http://projectsoft:9000'
				}
			}
		},
		watch: {
			options: {
				livereload: true,
			},
			less: {
				files: [
					'src/less/*.*',
					'src/less/**/*.*',
				],
				tasks: [
					'less',
					'group_css_media_queries',
					'replace',
					'cssmin',
					'pug:serv',
					'pug:tpl',
				]
			},
			js: {
				files: [
					'src/js/*.*',
					'src/js/**/*.*',
				],
				tasks: [
					'requirejs',
					'uglify',
					'pug:serv',
					'pug:tpl',
				]
			},
			pug: {
				files: [
					'src/pug/*.*',
					'src/pug/**/*.*',
				],
				tasks: [
					'pug:serv',
					'pug:tpl',
				]
			},
			images: {
				files: [
					'src/images/*.*',
					'src/images/**/*.*',
				],
				tasks: [
					'imagemin',
					'tinyimg',
					'pug:serv',
					'pug:tpl',
				]
			},
			glyph : {
				files: [
					'src/glyph/**/*.*',
				],
				tasks: [
					'webfont',
					'ttf2eot',
					'ttf2woff',
					'ttf2woff2',
					'copy',
					'less',
					'group_css_media_queries',
					'replace',
					'cssmin',
					'pug:serv',
					'pug:tpl',
				]
			}
		}
	});
	grunt.registerTask('default', [
		'webfont',
		'ttf2eot',
		'ttf2woff',
		'ttf2woff2',
		'copy',
		'less',
		'group_css_media_queries',
		'replace',
		'cssmin',
		'requirejs',
		'uglify',
		'imagemin',
		'tinyimg',
		'pug',
	]);
	grunt.registerTask('dev',[
		//'connect',
		'watch'
	]);
	grunt.registerTask('minimal',[
		'less',
		'group_css_media_queries',
		'replace',
		'cssmin',
		'pug'
	]);
}