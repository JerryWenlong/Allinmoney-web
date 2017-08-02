{
        baseUrl:"../js",
        dir:"../build/login",
        optimize:"uglify",
        optimizeCss:"standard.keepLines",
        mainConfigFile:"../js/appLogin/main.js",
        removeCombined: true,
        fileExclusionRegExp:/^\./,
        modules:[
            {
                name:'appLogin/main',
            }
        ]
}
