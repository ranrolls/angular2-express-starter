const gulp = require('gulp');
const runSequence = require('run-sequence');
const path = require('path');
let mkdirp = require('mkdirp');

const mitelBuildConfig = 'node_modules/@mitel/build-config';
const tasks = require('./' + mitelBuildConfig + '/etc/gulp-common.js');
const assetsComponentTasks = require('./node_modules/@mitel/assets/gulp-integrate.js');
const standardTasks = require('./' + mitelBuildConfig + '/etc/gulp-copy-standard.js');
let mitelConfigPath = (p) => path.join(__dirname, mitelBuildConfig, 'etc', p);
let mitelConfigPathWP = (p) => path.join(__dirname, mitelBuildConfig, 'etc', 'webpack', p);

const wrapperConf = {
    configFile: 'config/generator-config.json',
    generatorOutputDir: './src/integration'
}

const myConf = {
    destDir: 'dist',
    packageFile: 'package.json',
}

const copyConf = {
    conf: {
        from: [
            myConf.packageFile,
            mitelConfigPathWP('systemjs.config.js')
        ],
        to: myConf.destDir
    },
}

const jenkinsConf = {
    fromUrl: 'http://jenkins2.telepo.com/job/component-agent-availability/job/component-agent-availability-master/config.xml',
    to: 'config/jenkins-config.xml'
};

standardTasks.setupTasks(myConf.destDir);

gulp.task('wrapper', tasks.wrapperGenerator(wrapperConf, myConf.destDir));
gulp.task('wrapper-cleanup', tasks.wrapperGeneratorCleanup(wrapperConf));
gulp.task('copy:all', tasks.multiCopy([copyConf.conf]));

gulp.task('copy:assets', assetsComponentTasks.copyTo(myConf.destDir));
gulp.task('copy:standard', standardTasks.copyAll(myConf.destDir));
gulp.task('copy:components', function (callback) {
    runSequence(
        'copy:assets',
        'copy:standard',
        callback);
});

gulp.task('default', ['build']);

gulp.task('build', function(callback) {
    runSequence('clean', 'less', 'wrapper', 'tsc', 'copy:all', 'copy:components', 'wrapper-cleanup', 'package', callback);
});

gulp.task('jenkins:config', tasks.getJenkinsConfig(jenkinsConf));
gulp.task('copy:pkgwp', ['packageWP']);

var fuseConfig = {
    componentName: 'agent-list',
    componentTitle: 'AgentList',
    fuseDestDir: 'out/i_app',
    prodDestDir: 'out/p_app',
    refUpdateFiles: [
        'src/main.ts',
        'src/test/demo/app/app.component.spec.ts',
        'src/test/app.component.spec.ts'
    ]
};

standardTasks.setupFuse(fuseConfig);

var demoConfig = {
    prod: 'out/p_app',
    fuse: 'out/i_app',
    demo: 'out/dist/demo'
};

standardTasks.setupDemo(demoConfig);
