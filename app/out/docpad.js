// Generated by CoffeeScript 1.4.0
var appPath, balUtil, docpadConfig, feedr, fsUtil, getCategoryName, getLabelName, getLinkName, getName, getProjectName, humanize, moment, navigationData, pathUtil, requireFresh, rootPath, sitePath, strUtil, textData, _,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
  __hasProp = {}.hasOwnProperty;

fsUtil = require('fs');

pathUtil = require('path');

_ = require('underscore');

moment = require('moment');

strUtil = require('underscore.string');

balUtil = require('bal-util');

requireFresh = balUtil.requireFresh;

feedr = new (require('feedr').Feedr);

rootPath = __dirname + '/../..';

appPath = __dirname;

sitePath = rootPath + '/site';

textData = requireFresh(appPath + '/templateData/text');

navigationData = requireFresh(appPath + '/templateData/navigation');

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
    underscore: _,
    strUtil: strUtil,
    moment: moment,
    text: textData,
    navigation: navigationData,
    site: {
      url: "http://docpad.org",
      title: "DocPad - Streamlined Web Development",
      description: "Empower your website frontends with layouts, meta-data, pre-processors (markdown, jade, coffeescript, etc.), partials, skeletons, file watching, querying, and an amazing plugin system. Use it either standalone, as a build script, or even as a module in a bigger system. Either way, DocPad will streamline your web development process allowing you to craft full-featured websites quicker than ever before.",
      keywords: "bevry, bevryme, balupton, benjamin lupton, docpad, node, node.js, javascript, coffeescript, query engine, queryengine, backbone.js, cson",
      styles: ["/vendor/ui-lightness/jquery-ui-1.9.2.custom.css", '/vendor/highlight.css', '/vendor/normalize.css', '/vendor/h5bp.css', '/styles/style.css'],
      scripts: ["/vendor/jquery.js", "/vendor/jquery-ui-1.9.2.custom.js", "/vendor/log.js", "/vendor/jquery.scrollto.js", "/vendor/modernizr.js", "/vendor/history.js", "/scripts/historyjsit.js", "/scripts/bevry.js", "/scripts/script.js"]
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
    }
  },
  collections: {
    docs: function(database) {
      var query, sorting;
      query = {
        relativeOutDirPath: {
          $startsWith: 'docs'
        },
        body: {
          $ne: ""
        }
      };
      sorting = [
        {
          categoryDirectory: 1,
          filename: 1
        }
      ];
      return database.findAllLive(query, sorting).on('add', function(document) {
        var a, category, categoryDirectory, categoryName, compatibility, layout, name, pageTitle, slug, standalone, title, url, urls;
        a = document.attributes;
        layout = 'doc';
        standalone = true;
        categoryDirectory = pathUtil.basename(pathUtil.dirname(a.fullPath));
        category = categoryDirectory.replace(/^[\-0-9]+/, '');
        categoryName = getCategoryName(category);
        name = a.basename.replace(/^[\-0-9]+/, '');
        url = "/docs/" + category + "-" + name + ".html";
        slug = "/docs/" + name;
        compatibility = "/docpad/" + name;
        urls = [slug, compatibility];
        title = "" + (a.title || humanize(name));
        pageTitle = "" + title + " | " + categoryName;
        return document.setMetaDefaults({
          title: title,
          pageTitle: pageTitle,
          layout: layout,
          categoryDirectory: categoryDirectory,
          category: category,
          categoryName: categoryName,
          slug: slug,
          url: url,
          urls: urls,
          standalone: standalone
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
    }
  },
  environments: {
    development: {
      coffeekup: {
        format: false
      }
    }
  },
  events: {
    generateBefore: function(opts, next) {
      var config, docpad, repoKey, repoValue, repos, tasks;
      docpad = this.docpad;
      config = docpad.getConfig();
      tasks = new balUtil.Group(next);
      if (opts.reset === false || __indexOf.call(docpad.getEnvironments(), 'development') >= 0) {
        return next();
      }
      docpad.log('info', "Updating Documentation...");
      repos = {
        'docpad-documentation': {
          path: pathUtil.join(config.documentsPaths[0], 'docs'),
          url: 'git://github.com/bevry/docpad-documentation.git'
        }
      };
      for (repoKey in repos) {
        if (!__hasProp.call(repos, repoKey)) continue;
        repoValue = repos[repoKey];
        tasks.push(repoValue, function(complete) {
          return balUtil.initOrPullGitRepo(balUtil.extend({
            remote: 'origin',
            branch: 'master',
            output: true,
            next: function(err) {
              if (err) {
                docpad.warn(err);
              }
              docpad.log('info', "Updated Documentation");
              return complete();
            }
          }, this));
        });
      }
      tasks.async();
    },
    extendTemplateData: function(opts, next) {
      var contributorFeeds, contributors, docpad, tasks;
      docpad = this.docpad;
      contributors = {};
      opts.templateData.contributors = {};
      docpad.log('info', "Fetching Contributors...");
      tasks = new balUtil.Group(function(err) {
        var contributorName, contributorsNames, _i, _len;
        if (err) {
          return next(err);
        }
        delete contributors['benjamin lupton'];
        contributorsNames = _.keys(contributors).sort();
        for (_i = 0, _len = contributorsNames.length; _i < _len; _i++) {
          contributorName = contributorsNames[_i];
          opts.templateData.contributors[contributorName] = contributors[contributorName];
        }
        docpad.log('info', "Fetched Contributors");
        return next();
      });
      if (!(process.env.BEVRY_GITHUB_CLIENT_ID && process.env.BEVRY_GITHUB_CLIENT_SECRET)) {
        docpad.log('warn', "Unable to Fetch Contributors!");
        return next();
      }
      contributorFeeds = ["https://api.github.com/users/docpad/repos?client_id=" + process.env.BEVRY_GITHUB_CLIENT_ID + "&client_secret=" + process.env.BEVRY_GITHUB_CLIENT_SECRET, "https://api.github.com/users/bevry/repos?client_id=" + process.env.BEVRY_GITHUB_CLIENT_ID + "&client_secret=" + process.env.BEVRY_GITHUB_CLIENT_SECRET];
      feedr.readFeeds(contributorFeeds, function(err, feedRepos) {
        var packageUrl, repo, repos, _i, _j, _len, _len1;
        for (_i = 0, _len = feedRepos.length; _i < _len; _i++) {
          repos = feedRepos[_i];
          for (_j = 0, _len1 = repos.length; _j < _len1; _j++) {
            repo = repos[_j];
            packageUrl = repo.html_url.replace('//github.com', '//raw.github.com') + '/master/package.json';
            tasks.push({
              repo: repo,
              packageUrl: packageUrl
            }, function(complete) {
              return feedr.readFeed(this.packageUrl, function(err, packageData) {
                var contributor, contributorData, contributorId, contributorMatch, _k, _len2, _ref;
                if (err || !packageData) {
                  return complete();
                }
                _ref = packageData.contributors || [];
                for (_k = 0, _len2 = _ref.length; _k < _len2; _k++) {
                  contributor = _ref[_k];
                  contributorMatch = /^([^<(]+)\s*(?:<(.+?)>)?\s*(?:\((.+?)\))?$/.exec(contributor);
                  if (!contributorMatch) {
                    continue;
                  }
                  contributorData = {
                    name: (contributorMatch[1] || '').trim(),
                    email: (contributorMatch[2] || '').trim(),
                    url: (contributorMatch[3] || '').trim()
                  };
                  contributorId = contributorData.name.toLowerCase();
                  contributors[contributorId] = contributorData;
                }
                return complete();
              });
            });
          }
        }
        return tasks.async();
      });
    },
    writeAfter: function(opts, next) {
      var config, docpad, siteUrl, sitemap, sitemapPath;
      docpad = this.docpad;
      config = docpad.getConfig();
      sitemap = [];
      sitemapPath = config.outPath + '/sitemap.txt';
      siteUrl = config.templateData.site.url;
      docpad.getCollection('html').forEach(function(document) {
        if (document.get('sitemap') !== false && document.get('write') !== false && document.get('ignored') !== true && document.get('body')) {
          return sitemap.push(siteUrl + document.get('url'));
        }
      });
      balUtil.writeFile(sitemapPath, sitemap.sort().join('\n'), next);
    },
    serverExtend: function(opts) {
      var docpad, express, request, server;
      server = opts.server, express = opts.express;
      docpad = this.docpad;
      request = require('request');
      server.all('/pushover', function(req, res) {
        if (__indexOf.call(docpad.getEnvironments(), 'development') >= 0) {
          return res.send(200);
        }
        return request({
          url: "https://api.pushover.net/1/messages.json",
          method: "POST",
          form: balUtil.extend({
            token: envConfig.BEVRY_PUSHOVER_TOKEN,
            user: envConfig.BEVRY_PUSHOVER_USER_KEY,
            message: req.query
          }, req.query)
        }, function(_req, _res, body) {
          return res.send(body);
        });
      });
      server.get(/^\/((?:support|node|joe|query-?engine).*)$/, function(req, res) {
        var bevryUrl;
        bevryUrl = req.params[0] || '';
        return res.redirect(301, "https://bevry.me/" + bevryUrl);
      });
      server.get(/^\/(?:i|issues)(?:\/(.*))?$/, function(req, res) {
        var issueQuery;
        issueQuery = req.params[0] || '';
        return res.redirect(301, "https://github.com/bevry/" + issueQuery);
      });
      server.get(/^\/(?:p|plugins)(?:\/(.*))?$/, function(req, res) {
        var plugin;
        plugin = req.params[0] || '';
        return res.redirect(301, "https://github.com/docpad/docpad-plugin-" + plugin);
      });
    }
  }
};

module.exports = docpadConfig;
