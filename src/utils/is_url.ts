export function isUrl(url: string) {
    if(url.match(/^(http(s)?:\/\/)[^\s]+\.[^\s]+$/)){
        return true;
    }else{
        return false;
    }
} 