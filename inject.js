/*global chrome*/
console.log("Injected!");
console.log("Proxy XHR running!");

//The "URL" in Modified url:response pair will be the last part of an URL 
const genRouterValue = (url) =>{
  var urlList = String(url).split("/");
    //The last part of urlList, used for parameter processing
    const urlName = urlList[urlList.length - 1];
    const urlSplit = urlName.split("?");
    var routerValue = "";
    // If there is parameter
    if (urlSplit.length > 1) {
      routerValue = String(urlName.split("?")[0]) + "*";
    }
    // If there is no parameter
    else {
      routerValue = urlName;
    }
    // Special case for OAuth Apps
    const urlPrefix = urlName.split("?")[0];
      if (urlPrefix === "oauth-apps") {
        const params = urlName.split("?")[1];
        const pageInfo = params.split("&")[1];
        routerValue += String(pageInfo);
      }

    return routerValue;
}

let ajax_response = {
    settings: {
      ajaxInterceptor_switchOn: true,
      ajaxInterceptor_rules: [],
    },
    originalXHR: window.XMLHttpRequest,
    myXHR: function() {
      let pageScriptEventDispatched = false;
      const modifyResponse = () => {
        console.log("Modify!");
        ajax_response.settings.ajaxInterceptor_rules.forEach(i => {
          let matched = false;
            console.log(genRouterValue(this.responseURL),i.data_url);
            if (genRouterValue(this.responseURL) == i.data_url) {
              matched = true;
              console.log("Matched!");
          }
          if (matched) {
            this.responseText = i.response;
            this.response = i.response;
            console.log("Replaced!");
            
            if (!pageScriptEventDispatched) {
              window.dispatchEvent(new CustomEvent("pageScript", {
                detail: {url: this.responseURL}
              }));
              pageScriptEventDispatched = true;
            }
          }
        });
      }
      
      const xhr = new ajax_response.originalXHR;
      for (let attr in xhr) {
        if (attr === 'onreadystatechange') {
          xhr.onreadystatechange = (...args) => {
            if (this.readyState == 4) {
              if (ajax_response.settings.ajaxInterceptor_switchOn) {
                modifyResponse();
              }
            }
            this.onreadystatechange && this.onreadystatechange.apply(this, args);
          }
          continue;
        } else if (attr === 'onload') {
          xhr.onload = (...args) => {
            if (ajax_response.settings.ajaxInterceptor_switchOn) {
              modifyResponse();
            }
            this.onload && this.onload.apply(this, args);
          }
          continue;
        }
    
        if (typeof xhr[attr] === 'function') {
          this[attr] = xhr[attr].bind(xhr);
        } else {
          if (attr === 'responseText' || attr === 'response') {
            Object.defineProperty(this, attr, {
              get: () => this[`_${attr}`] == undefined ? xhr[attr] : this[`_${attr}`],
              set: (val) => this[`_${attr}`] = val,
              enumerable: true
            });
          } else {
            Object.defineProperty(this, attr, {
              get: () => xhr[attr],
              set: (val) => xhr[attr] = val,
              enumerable: true
            });
          }
        }
      }
    },
  
    originalFetch: window.fetch.bind(window)
   /*myFetch: function(...args) {
      return ajax_response.originalFetch(...args).then((response) => {
        let txt = undefined;
        ajax_response.settings.ajaxInterceptor_rules.forEach(({filterType = 'normal', switchOn = true, match, overrideTxt = ''}) => {
          let matched = false;
          if (switchOn && match) {
            if (filterType === 'normal' && response.url.indexOf(match) > -1) {
              matched = true;
            } else if (filterType === 'regex' && response.url.match(new RegExp(match, 'i'))) {
              matched = true;
            }
          }
  
          if (matched) {
            window.dispatchEvent(new CustomEvent("pageScript", {
              detail: {url: response.url, match}
            }));
            txt = overrideTxt;
          }
        });

        ajax_response.settings.ajaxInterceptor_rules.forEach(i => {
          let matched = false;
          if (switchOn) {
            if (this.responseURL == i.data_url) {
              matched = true;
            }
          }
          if (matched) {
            window.dispatchEvent(new CustomEvent("pageScript", {
              detail: {url: i.url}
            }));
            txt = i.response;
          }
        });
  
        if (txt !== undefined) {
          const stream = new ReadableStream({
            start(controller) {

              controller.enqueue(new TextEncoder().encode(txt));
              controller.close();
            }
          });
    
          const newResponse = new Response(stream, {
            headers: response.headers,
            status: response.status,
            statusText: response.statusText,
          });
          const proxy = new Proxy(newResponse, {
            get: function(target, name){
              switch(name) {
                case 'ok':
                case 'redirected':
                case 'type':
                case 'url':
                case 'useFinalURL':
                case 'body':
                case 'bodyUsed':
                  return response[name];
              }
              return target[name];
            }
          });
    
          for (let key in proxy) {
            if (typeof proxy[key] === 'function') {
              proxy[key] = proxy[key].bind(newResponse);
            }
          }
    
          return proxy;
        } else {
          return response;
        }
      });
    },*/
  }
  
  window.addEventListener("message", function(event) {
    console.log("Event: ",event);
    const data = event.data;
    console.log(data.to);
    if (data.to === 'inject') {
      console.log("New rule received!");
      let new_url_response = {};
      new_url_response.data_url = data.url;
      new_url_response.data_response = data.response;
      ajax_response.settings.ajaxInterceptor_rules.push(new_url_response);
    }
  
    if (ajax_response.settings.ajaxInterceptor_switchOn) {
      window.XMLHttpRequest = ajax_response.myXHR;
      window.fetch = ajax_response.originalFetch;
    } else {
      window.XMLHttpRequest = ajax_response.originalXHR;
      window.fetch = ajax_response.originalFetch;
    }
  }, false);