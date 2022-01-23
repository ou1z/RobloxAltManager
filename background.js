// chrome.storage.local.clear()
let currentHost = 'https://www.roblox.com'


function refresh() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.reload(tabs[0].id)
    })
}

chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
    if(message.method == "saveAccount") {
        
        chrome.cookies.get({"url": "https://www.roblox.com/", "name": ".ROBLOSECURITY"}, function(cookie) {
            if (cookie) {
                chrome.storage.local.get(null, accounts => {
                    fetch('https://users.roblox.com/v1/users/authenticated', {
                        headers:{'Cookie': '.ROBLOSECURITY='+cookie.value}
                    }).then(t=>t.json()).then(t=>{
                        const name = t.name
                        if (!accounts[name]) {
                            chrome.storage.local.set({[name]: cookie}, () => {
                                sendResponse(true)
                            })
                        }
                    })
                })
                
            }
        })
        return true
    }
    else if (message.method == 'setCookie') {
        chrome.cookies.set(
            { 
                url: currentHost, 
                name: ".ROBLOSECURITY", 
                value: message.cookie.value, 
                domain: '.roblox.com',
                secure: false,
                httpOnly: true,
                path: '/'
            }, refresh)
        return true
    }
    else if (message.method == 'removeCookie') {
        chrome.cookies.getAll({ url: currentHost, name: '.ROBLOSECURITY' }, cookies => {
            for (let cookie of cookies) {
                chrome.cookies.remove({ url: currentHost, name: '.ROBLOSECURITY'})
            }
            refresh()
        })
        return true
    }
    else if (message.method == 'removeAccount') {
        chrome.storage.local.remove(message.account, () => {
            sendResponse(true)
        })
        return true
    }
    return sendResponse(false)
})