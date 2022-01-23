const save = document.getElementById('save')
const dropdown = document.getElementById('accounts')
const load = document.getElementById('load')
const logout = document.getElementById('logout')
const remove = document.getElementById('remove')
const clickSound = new Audio(chrome.runtime.getURL("click.mp3"));

let accounts = {}
chrome.storage.local.get(null, a => {
    accounts = a  
    refreshDropdown()
})

function refreshDropdown() {
    chrome.storage.local.get(null, a => {
        accounts = a  
        
        while (dropdown.firstChild) {
            dropdown.firstChild.remove()
        }

        for (let account of Object.keys(accounts)) {
            let elem = document.createElement('option')
            elem.value = account
            elem.innerText = account
            elem.class = 'account-option'
            dropdown.appendChild(elem)
        }
    })
}

save.addEventListener('click', () => {
    clickSound.play()
    chrome.runtime.sendMessage({method:"saveAccount"}, response => {
        refreshDropdown()
    })
})

load.addEventListener('click', () => {
    clickSound.play()
    if (accounts[dropdown.value]) {
        chrome.runtime.sendMessage({method:'setCookie',cookie:accounts[dropdown.value]}, response => {
            if (response == 'refresh') {
                console.log('refreshing')
            }
        })
    }
})

logout.addEventListener('click', () => {
    clickSound.play()
    if (accounts[dropdown.value]) {
        chrome.runtime.sendMessage({method:'removeCookie'})
    }
})

remove.addEventListener('click', () => {
    clickSound.play()
    if (accounts[dropdown.value]) {
        chrome.runtime.sendMessage({method:'removeAccount',account:dropdown.value}, response => {
            refreshDropdown()
        })
    }
})