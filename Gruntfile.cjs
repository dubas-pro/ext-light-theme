/************************************************************************
This file is part of the Dubas Light Theme - EspoCRM extension.

DUBAS S.C. - contact@dubas.pro
Copyright (C) 2023-2025 Arkadiy Asuratov, Emil Dubielecki

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
const modulePath = './src/files/custom/Espo/Modules/DubasLightTheme';
const clientModulePath = './src/files/client/custom/modules/dubas-light-theme';

module.exports = grunt => {

    let themeList = [];

    fs.readdirSync(modulePath + '/Resources/metadata/themes').forEach(file => {
        themeList.push(file.substring(0, file.length - 5));
    });

    let cssminFilesData = {};

    let lessData = {};

    themeList.forEach(theme => {
        let name = camelCaseToHyphen(theme);

        let files = {};

        files[clientModulePath + '/css/espo/' + name + '.css'] = 'frontend/less/' + name + '/main.less';
        files[clientModulePath + '/css/espo/' + name + '-iframe.css'] = 'frontend/less/' + name + '/iframe/main.less';

        cssminFilesData[clientModulePath + '/css/espo/' + name + '.css'] = clientModulePath + '/css/espo/' + name + '.css';
        cssminFilesData[clientModulePath + '/css/espo/' + name + '-iframe.css'] = clientModulePath + '/css/espo/' + name + '-iframe.css';

        let o = {
            options: {
                yuicompress: true,
            },
            files: files,
        };

        lessData[theme] = o;
    });

    grunt.initConfig({
        clean: {
            start: [
                clientModulePath + '/fonts/*',
                clientModulePath + '/css/*',
            ],
        },

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
                dest: clientModulePath + '/fonts/',
                src: [
                    'site/client/fonts/summernote.ttf',
                    'site/client/fonts/summernote.woff',
                    'site/client/fonts/summernote.woff2',
                ],
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

function camelCaseToHyphen(string) {
    if (string === null) {
        return string;
    }

    return string.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}
