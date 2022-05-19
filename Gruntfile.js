const fs = require('fs');

module.exports = grunt => {

    let themeList = [];

    fs.readdirSync('src/files/custom/Espo/Modules/DubasLightTheme/Resources/metadata/themes').forEach(file => {
        themeList.push(file.substr(0, file.length - 5));
    });

    let cssminFilesData = {};

    let lessData = {};

    themeList.forEach(theme => {
        let name = camelCaseToHyphen(theme);

        let files = {};

        files['src/files/client/custom/modules/dubas-light-theme/css/espo/'+name+'.css'] = 'frontend/less/'+name+'/main.less';
        files['src/files/client/custom/modules/dubas-light-theme/css/espo/'+name+'-iframe.css'] = 'frontend/less/'+name+'/iframe/main.less';

        cssminFilesData['src/files/client/custom/modules/dubas-light-theme/css/espo/'+name+'.css'] = 'src/files/client/custom/modules/dubas-light-theme/css/espo/'+name+'.css';
        cssminFilesData['src/files/client/custom/modules/dubas-light-theme/css/espo/'+name+'-iframe.css'] = 'src/files/client/custom/modules/dubas-light-theme/css/espo/'+name+'-iframe.css';

        let o = {
            options: {
                yuicompress: true,
            },
            files: files,
        };

        lessData[theme] = o;
    });

    grunt.initConfig({
        less: lessData,

        cssmin: {
            themes: {
                files: cssminFilesData,
            },
        },
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask('css', [
        'less',
        'cssmin',
    ]);

    grunt.registerTask('default', [
        'css',
    ]);
};

function camelCaseToHyphen(string){
    if (string === null) {
        return string;
    }

    return string.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}
