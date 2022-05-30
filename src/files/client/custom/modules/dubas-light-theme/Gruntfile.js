/************************************************************************
This file is part of the Dubas Theme - EspoCRM extension.

DUBAS S.C. - contact@dubas.pro
Copyright (C) 2022-2022 Arkadiy Asuratov, Emil Dubielecki

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
************************************************************************/

const fs = require('fs');

module.exports = grunt => {

    let themeList = [];

    fs.readdirSync('../../../../custom/Espo/Modules/DubasLightTheme/Resources/metadata/themes').forEach(file => {
        themeList.push(file.substring(0, file.length - 5));
    });

    let cssminFilesData = {};

    let lessData = {};

    themeList.forEach(theme => {
        let name = camelCaseToHyphen(theme);

        let files = {};

        files['css/espo/'+name+'.css'] = 'frontend/less/'+name+'/main.less';
        files['css/espo/'+name+'-iframe.css'] = 'frontend/less/'+name+'/iframe/main.less';

        cssminFilesData['css/espo/'+name+'.css'] = 'css/espo/'+name+'.css';
        cssminFilesData['css/espo/'+name+'-iframe.css'] = 'css/espo/'+name+'-iframe.css';

        let o = {
            options: {
                yuicompress: true,
            },
            files: files,
        };

        lessData[theme] = o;
    });

    let fontsToCopy = [
        'node_modules/espocrm/client/fonts/summernote.eot',
        'node_modules/espocrm/client/fonts/summernote.ttf',
        'node_modules/espocrm/client/fonts/summernote.woff',
        'node_modules/espocrm/client/fonts/summernote.woff2',
    ];

    grunt.initConfig({
        less: lessData,

        cssmin: {
            themes: {
                files: cssminFilesData,
            },
        },

        copy: {
            options: {
                mode: true,
            },
            fonts: {
                expand: true,
                flatten: true,
                src: fontsToCopy,
                dest: 'fonts/',
            },
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-less');

    grunt.registerTask('css', [
        'less',
        'cssmin',
        'copy',
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
