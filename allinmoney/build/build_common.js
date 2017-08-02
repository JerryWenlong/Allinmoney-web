{
        baseUrl:"../js",
        dir:"../build/common",
        optimize:"uglify",
        optimizeCss:"standard.keepLines",
        mainConfigFile:"../js/common/main.js",
        removeCombined: true,
        fileExclusionRegExp:/^\./,
        modules:[
            {
                name:'common/main',
            }
        ]
}
