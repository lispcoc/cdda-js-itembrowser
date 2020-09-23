env_lang = "ja";

function getLanguage()
    {
        if (navigator.appName == 'Netscape')
        var language = navigator.language;
        else
        var language = navigator.browserLanguage;
        if (language.indexOf('en') > -1) env_lang = "en";
        else if (language.indexOf('ja') > -1) env_lang = "ja";
        else if (language.indexOf('zh') > -1) env_lang = "zh_CN";
        else
        env_lang = "ja";
    }