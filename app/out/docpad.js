// Generated by CoffeeScript 1.6.3
(function() {
  var appPath, contributors, contributorsGetter, docpadConfig, extendr, fsUtil, getCategoryName, getLabelName, getLinkName, getName, getProjectName, humanize, moment, navigationData, pathUtil, requireFresh, rootPath, sitePath, siteUrl, strUtil, textData, websiteVersion,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  fsUtil = require('fs');

  pathUtil = require('path');

  moment = require('moment');

  strUtil = require('underscore.string');

  requireFresh = require('requirefresh').requireFresh;

  extendr = require('extendr');

  rootPath = __dirname + '/../..';

  appPath = __dirname;

  sitePath = rootPath + '/site';

  textData = requireFresh(appPath + '/templateData/text');

  navigationData = requireFresh(appPath + '/templateData/navigation');

  websiteVersion = require(rootPath + '/package.json').version;

  siteUrl = process.env.NODE_ENV === 'production' ? "http://docpad.org" : "http://localhost:9778";

  contributorsGetter = null;

  contributors = null;

  getName = function(a, b) {
    var _ref, _ref1;
    if (b === null) {
      return (_ref = textData[b]) != null ? _ref : humanize(b);
    } else {
      return (_ref1 = textData[a][b]) != null ? _ref1 : humanize(b);
    }
  };

  getProjectName = function(project) {
    return getName('projectNames', project);
  };

  getCategoryName = function(category) {
    return getName('categoryNames', category);
  };

  getLinkName = function(link) {
    return getName('linkNames', link);
  };

  getLabelName = function(label) {
    return getName('labelNames', label);
  };

  humanize = function(text) {
    if (text == null) {
      text = '';
    }
    return strUtil.humanize(text.replace(/^[\-0-9]+/, '').replace(/\..+/, ''));
  };

  docpadConfig = {
    rootPath: rootPath,
    outPath: rootPath + '/site/out',
    srcPath: rootPath + '/site/src',
    reloadPaths: [appPath],
    regenerateEvery: 1000 * 60 * 60 * 24,
    templateData: {
      strUtil: strUtil,
      moment: moment,
      text: textData,
      navigation: navigationData,
      site: {
        url: siteUrl,
        title: "DocPad - Streamlined Web Development",
        description: "Empower your website frontends with layouts, meta-data, pre-processors (markdown, jade, coffeescript, etc.), partials, skeletons, file watching, querying, and an amazing plugin system. Use it either standalone, as a build script, or even as a module in a bigger system. Either way, DocPad will streamline your web development process allowing you to craft full-featured websites quicker than ever before.",
        keywords: "bevry, bevryme, balupton, benjamin lupton, docpad, node, node.js, javascript, coffeescript, query engine, queryengine, backbone.js, cson",
        services: {
          ircwebchat: 'docpad',
          travisStatusButton: 'bevry/docpad',
          furyButton: 'docpad',
          gittipButton: 'docpad',
          flattrButton: '344188/balupton-on-Flattr',
          paypalButton: 'QB8GQPZAH84N6',
          facebookLikeButton: {
            applicationId: '266367676718271'
          },
          twitterTweetButton: 'docpad',
          twitterFollowButton: 'docpad',
          githubStarButton: 'bevry/docpad',
          disqus: 'docpad',
          gauges: '50dead2bf5a1f541d7000008',
          googleAnalytics: 'UA-35505181-2',
          inspectlet: '746529266',
          mixpanel: 'd0f9b33c0ec921350b5419352028577e',
          reinvigorate: '89t63-62ne18262h'
        },
        styles: ['/vendor/normalize.css', '/vendor/h5bp.css', '/vendor/highlight.css', '/styles/style.css'].map(function(url) {
          return "" + url + "?websiteVersion=" + websiteVersion;
        }),
        scripts: ["/vendor/jquery.js", "/vendor/jquery-scrollto.js", "/vendor/modernizr.js", "/vendor/history.js", "/vendor/historyjsit.js", "/scripts/bevry.js", "/scripts/script.js"].map(function(url) {
          return "" + url + "?websiteVersion=" + websiteVersion;
        })
      },
      getName: getName,
      getProjectName: getProjectName,
      getCategoryName: getCategoryName,
      getLinkName: getLinkName,
      getLabelName: getLabelName,
      getPreparedTitle: function() {
        if (this.document.pageTitle !== false && this.document.title) {
          return "" + (this.document.pageTitle || this.document.title) + " | " + this.site.title;
        } else if (this.document.pageTitle === false || (this.document.title != null) === false) {
          return this.site.title;
        }
      },
      getPreparedDescription: function() {
        return this.document.description || this.site.description;
      },
      getPreparedKeywords: function() {
        return this.site.keywords.concat(this.document.keywords || []).join(', ');
      },
      getVersion: function(v, places) {
        if (places == null) {
          places = 1;
        }
        return v.split('.').slice(0, places).join('.');
      },
      readFile: function(relativePath) {
        var path, result;
        path = this.document.fullDirPath + '/' + relativePath;
        result = fsUtil.readFileSync(path);
        if (result instanceof Error) {
          throw result;
        } else {
          return result.toString();
        }
      },
      codeFile: function(relativePath, language) {
        var contents;
        if (language == null) {
          language = pathUtil.extname(relativePath).substr(1);
        }
        contents = this.readFile(relativePath);
        return "<pre><code class=\"" + language + "\">" + contents + "</code></pre>";
      },
      getContributors: function() {
        return contributors || [];
      }
    },
    collections: {
      docs: function(database) {
        var query, sorting;
        query = {
          write: true,
          relativeOutDirPath: {
            $startsWith: 'learn/'
          },
          body: {
            $ne: ""
          }
        };
        sorting = [
          {
            projectDirectory: 1,
            categoryDirectory: 1,
            filename: 1
          }
        ];
        return database.findAllLive(query, sorting).on('add', function(document) {
          var a, basename, category, categoryDirectory, categoryName, editUrl, githubEditUrl, layout, name, organisation, organisationDirectory, organisationName, pageTitle, pathDetails, pathDetailsExtractor, project, projectDirectory, projectName, proseEditUrl, standalone, title, urls;
          a = document.attributes;
          /*
          				learn/#{organisation}/#{project}/#{category}/#{filename}
          */

          pathDetailsExtractor = /^.*?learn\/(.+?)\/(.+?)\/(.+?)\/(.+?)\.(.+?)$/;
          pathDetails = pathDetailsExtractor.exec(a.relativePath);
          layout = 'doc';
          standalone = true;
          organisationDirectory = organisation = organisationName = projectDirectory = project = projectName = categoryDirectory = category = categoryName = title = pageTitle = null;
          if (pathDetails != null) {
            organisationDirectory = pathDetails[1];
            projectDirectory = pathDetails[2];
            categoryDirectory = pathDetails[3];
            basename = pathDetails[4];
            organisation = organisationDirectory.replace(/[\-0-9]+/, '');
            organisationName = humanize(project);
            project = projectDirectory.replace(/[\-0-9]+/, '');
            projectName = getProjectName(project);
            category = categoryDirectory.replace(/^[\-0-9]+/, '');
            categoryName = getCategoryName(category);
            name = basename.replace(/^[\-0-9]+/, '');
            title = "" + (a.title || humanize(name));
            pageTitle = "" + title + " | DocPad";
            urls = ["/docs/" + name, "/docs/" + category + "-" + name, "/docpad/" + name];
            githubEditUrl = "https://github.com/" + organisationDirectory + "/" + projectDirectory + "/edit/master/";
            proseEditUrl = "http://prose.io/#" + organisationDirectory + "/" + projectDirectory + "/edit/master/";
            editUrl = githubEditUrl + a.relativePath.replace("learn/" + organisationDirectory + "/" + projectDirectory + "/", '');
            return document.setMetaDefaults({
              layout: layout,
              standalone: standalone,
              name: name,
              title: title,
              pageTitle: pageTitle,
              url: urls[0],
              editUrl: editUrl,
              organisationDirectory: organisationDirectory,
              organisation: organisation,
              organisationName: organisationName,
              projectDirectory: projectDirectory,
              project: project,
              projectName: projectName,
              categoryDirectory: categoryDirectory,
              category: category,
              categoryName: categoryName
            }).addUrl(urls);
          } else {
            console.log("The document " + a.relativePath + " was at an invalid path, so has been ignored");
            return document.setMetaDefaults({
              ignore: true,
              render: false,
              write: false
            });
          }
        });
      },
      partners: function(database) {
        return database.findAllLive({
          relativeOutDirPath: 'learn/docpad/documentation/partners'
        }, [
          {
            filename: 1
          }
        ]).on('add', function(document) {
          return document.setMetaDefaults({
            write: false
          });
        });
      },
      pages: function(database) {
        return database.findAllLive({
          relativeOutDirPath: 'pages'
        }, [
          {
            filename: 1
          }
        ]);
      }
    },
    plugins: {
      highlightjs: {
        aliases: {
          stylus: 'css'
        }
      },
      feedr: {
        feeds: {
          latestPackage: {
            url: "" + siteUrl + "/latest.json"
          },
          exchange: {
            url: "" + siteUrl + "/exchange.json"
          }
        }
      },
      repocloner: {
        repos: [
          {
            name: 'DocPad Documentation',
            path: 'src/documents/learn/docpad/documentation',
            url: 'https://github.com/bevry/docpad-documentation.git'
          }
        ]
      }
    },
    environments: {
      development: {
        templateData: {
          site: {
            services: {
              gauges: false,
              googleAnalytics: false,
              mixpanel: false,
              reinvigorate: false
            }
          }
        }
      }
    },
    events: {
      generateBefore: function(opts) {
        contributors = null;
        return true;
      },
      renderBefore: function(opts, next) {
        var docpad;
        docpad = this.docpad;
        if (contributors) {
          return next();
        }
        docpad.log('info', 'Fetching your latest contributors for display within the website');
        if (contributorsGetter == null) {
          contributorsGetter = require('getcontributors').create({
            github_client_id: process.env.BEVRY_GITHUB_CLIENT_ID,
            github_client_secret: process.env.BEVRY_GITHUB_CLIENT_SECRET
          });
        }
        contributorsGetter.fetchContributorsFromUsers(['bevry', 'docpad', 'webwrite'], function(err, _contributors) {
          if (_contributors == null) {
            _contributors = [];
          }
          if (err) {
            return next(err);
          }
          contributors = _contributors;
          docpad.log('info', "Fetched your latest contributors for display within the website, all " + _contributors.length + " of them");
          return next();
        });
        return true;
      },
      serverExtend: function(opts) {
        var codeBadRequest, codeRedirectPermanent, codeRedirectTemporary, codeSuccess, docpad, request, server;
        server = opts.server;
        docpad = this.docpad;
        request = require('request');
        codeSuccess = 200;
        codeBadRequest = 400;
        codeRedirectPermanent = 301;
        codeRedirectTemporary = 302;
        server.all('/pushover', function(req, res) {
          if (__indexOf.call(docpad.getEnvironments(), 'development') >= 0 || (process.env.BEVRY_PUSHOVER_TOKEN != null) === false) {
            return res.send(codeSuccess);
          }
          return request({
            url: "https://api.pushover.net/1/messages.json",
            method: "POST",
            form: extendr.extend({
              device: process.env.BEVRY_PUSHOVER_DEVICE || null,
              token: process.env.BEVRY_PUSHOVER_TOKEN,
              user: process.env.BEVRY_PUSHOVER_USER_KEY,
              message: req.query
            }, req.query)
          }, function(_req, _res, body) {
            return res.send(body);
          });
        });
        server.all('/regenerate', function(req, res) {
          var _ref;
          if (((_ref = req.query) != null ? _ref.key : void 0) === process.env.WEBHOOK_KEY) {
            docpad.log('info', 'Regenerating for documentation change');
            docpad.action('generate', {
              populate: true,
              reload: true
            });
            return res.send(codeSuccess, 'regenerated');
          } else {
            return res.send(codeBadRequest, 'key is incorrect');
          }
        });
        server.get('/exchange.json', function(req, res) {
          var branch, version;
          branch = 'master';
          version = (req.query.version || '').split('.');
          if (version) {
            if (version[0] === '5') {
              if (version[1] === '3') {
                branch = 'docpad-5.3.x';
              } else {
                branch = 'docpad-5.x';
              }
            } else if (version[0] === '6') {
              branch = 'docpad-6.x';
            }
          }
          return res.redirect(codeRedirectPermanent, "https://raw.github.com/bevry/docpad-extras/" + branch + "/exchange.json");
        });
        server.get('/latest.json', function(req, res) {
          return res.redirect(codeRedirectPermanent, "https://raw.github.com/bevry/docpad/master/package.json");
        });
        server.get(/^\/(plugins|upgrade|install|troubleshoot)\/?$/, function(req, res) {
          var relativeUrl;
          relativeUrl = req.params[0] || '';
          return res.redirect(codeRedirectPermanent, "" + siteUrl + "/docs/" + relativeUrl);
        });
        server.get(/^\/docpad(?:\/(.*))?$/, function(req, res) {
          var relativeUrl;
          relativeUrl = req.params[0] || '';
          return res.redirect(codeRedirectPermanent, "" + siteUrl + "/docs/" + relativeUrl);
        });
        server.get(/^\/((?:tos|terms|privacy|node|joe|query-?engine).*)$/, function(req, res) {
          var relativeUrl;
          relativeUrl = req.params[0] || '';
          return res.redirect(codeRedirectPermanent, "http://bevry.me/" + relativeUrl);
        });
        server.get(/^\/(?:g|github|bevry\/docpad)(?:\/(.*))?$/, function(req, res) {
          var relativeUrl;
          relativeUrl = req.params[0] || '';
          return res.redirect(codeRedirectPermanent, "https://github.com/bevry/docpad/" + relativeUrl);
        });
        server.get(/^\/(?:i|issues)(?:\/(.*))?$/, function(req, res) {
          var relativeUrl;
          relativeUrl = req.params[0] || '';
          return res.redirect(codeRedirectPermanent, "https://github.com/bevry/docpad/issues/" + relativeUrl);
        });
        server.get(/^\/(?:e|edit)(?:\/docs)?\/(.+)$/, function(req, res, next) {
          var fileRelativeUrl;
          fileRelativeUrl = '/docs/' + req.params[0];
          console.log('edit', fileRelativeUrl);
          return docpad.getFileByRoute(fileRelativeUrl, function(err, file) {
            var fileEditUrl;
            console.log('err', file);
            if (err || !file) {
              return docpad.serverMiddleware404(req, res, next);
            }
            fileEditUrl = file.get('editUrl');
            console.log('url', fileEditUrl);
            if (!fileEditUrl) {
              return docpad.serverMiddleware500(req, res, next);
            }
            return res.redirect(codeRedirectPermanent, fileEditUrl);
          });
        });
        server.get(/^\/(?:p|plugin)\/(.+)$/, function(req, res) {
          var plugin;
          plugin = req.params[0];
          return res.redirect(codeRedirectPermanent, "https://github.com/docpad/docpad-plugin-" + plugin);
        });
        server.get(/^\/(?:docs\/)?docpad-plugin-(.+)$/, function(req, res) {
          var plugin;
          plugin = req.params[0];
          return res.redirect(codeRedirectPermanent, "https://github.com/docpad/docpad-plugin-" + plugin);
        });
        server.get('/license', function(req, res) {
          return res.redirect(codeRedirectPermanent, "https://github.com/bevry/docpad/blob/master/LICENSE.md#readme");
        });
        server.get('/changes', function(req, res) {
          return res.redirect(codeRedirectPermanent, "https://github.com/bevry/docpad/blob/master/HISTORY.md#readme");
        });
        server.get('/chat-guidelines', function(req, res) {
          return res.redirect(codeRedirectPermanent, "https://github.com/bevry/docpad/issues/384");
        });
        server.get('/chat-logs', function(req, res) {
          return res.redirect(codeRedirectPermanent, "https://botbot.me/freenode/docpad/");
        });
        server.get('/chat', function(req, res) {
          return res.redirect(codeRedirectPermanent, "http://webchat.freenode.net/?channels=docpad");
        });
        server.get(/^\/(?:donate|gittip)$/, function(req, res) {
          return res.redirect(codeRedirectPermanent, "https://www.gittip.com/docpad/");
        });
        server.get('/gittip-community', function(req, res) {
          return res.redirect(codeRedirectPermanent, "https://www.gittip.com/for/docpad/");
        });
        server.get(/^\/(?:google\+|\+)$/, function(req, res) {
          return res.redirect(codeRedirectPermanent, "https://plus.google.com/communities/102027871269737205567");
        });
        server.get(/^\/(?:forum|stackoverflow)$/, function(req, res) {
          return res.redirect(codeRedirectPermanent, "http://stackoverflow.com/questions/tagged/docpad");
        });
      }
    }
  };

  module.exports = docpadConfig;

}).call(this);
