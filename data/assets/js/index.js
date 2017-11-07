/*!
 * Copyright 2017 Atelier Disko. All rights reserved.
 *
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */
document.addEventListener('DOMContentLoaded', function() {
  let $ = document.querySelectorAll.bind(document);
  let $1 = document.querySelector.bind(document);

  let nav = $1('.tree-nav');
  let search = $1('.search');
  let data = {};

  let handleSearch = function(ev) {
    if (this.value !== "") {
      runSearch(data, this.value);
    } else {
      renderNav(data);
    }
  };

  search.addEventListener("input", handleSearch);

  let handleNav = function(ev) {
      ev.preventDefault();
      fetch(this.href).then((res) => {
        return res.text();
      }).then((html) => {
        $1('main').innerHTML = html;
      });
  };

  fetch('/api/tree').then((res) => {
    return res.json();
  }).then((json) => {
    data = json.data.nodeList;
    renderNav(data);
  });

  // Runs the search and rebuilds the nav
  let runSearch = function(data, query) {
    let options = {
      tokenize: false,
      threshold: 0.4,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: [
        "title",
        "url",
        "meta.keywords"
    ]
    };

    let fuse = new Fuse(data, options);
    let result = fuse.search(query);

    renderNav(data, result);
  };

  // Renders the nav structure
  let renderNav = function(data, searchResult) {
    nav.innerHTML = '';

    data[0].keep = checkIfNodeShouldBeKept(data[0], searchResult);

    let list = createList(data[0]);
    let ul = document.createElement('ul');

    // Append list withouth root node (a bit hacky)
    if (list) {
      nav.appendChild(list.childNodes[1]);
    }
  };

  // If a searchResult is given, checks for each node if it exists in
  // the searchResult and should therefore be kept.
  let checkIfNodeShouldBeKept = function(data, filterBy) {
    if (filterBy !== undefined) {
      if (data.children !== null) {

        // Iterate over children, if one of the children should be kept, this node should be kept
        var keep = false;
        for (var child in data.children) {
            var keepChild = checkIfNodeShouldBeKept(data.children[child], filterBy);
            if (keepChild) {
              keep = true;
            }
        }

        // If this parent node itself is in the searchResults, it should be kept
        if (filterBy && data.url !== "/") {
          for (let i of filterBy) {
            if (i.url == data.url) {
              keep = true;
            }
          }
        }

        data.keep = keep;
        return keep;
      } else {
        // If this leaf node itself is in the searchResults, it should be kept
        if (filterBy && data.url !== "/") {
          var keep = false;
          for (let i of filterBy) {
            if (i.url == data.url) {
              keep = true;
            }
          }

          if (keep === true) {
            data.keep = true;
            return true;
          } else {
            data.keep = false;
            return false;
          }
        }

      }
    } else {
      // When no searchResult is given, all nodes should be kept.
      if (data.children !== null) {
        for (let child in data.children) {
            var keepChild = checkIfNodeShouldBeKept(data.children[child], filterBy);
        }
      }

      data.keep = true;
      return true;
    }
  };

  // Turns the given data into a "ul li" structure
  let createList = function(data) {
    if (data.keep !== false) {
      if (data.children !== null) {
        let li = document.createElement('li');
        let a  = document.createElement('a');

        a.href = '/tree/' + data.url;
        a.innerHTML = data.title;
        a.addEventListener('click', handleNav);
        li.appendChild(a);

        let ul = document.createElement('ul');
        li.appendChild(ul);

        for (var child in data.children) {
            var child = createList(data.children[child]);
            if (child) {
              ul.appendChild(child);
            }
        }

        return li;
      } else {
        let li = document.createElement('li');
        let a  = document.createElement('a');

        a.href = '/tree/' + data.url;
        a.innerHTML = data.title;
        a.addEventListener('click', handleNav);
        li.appendChild(a);

        return li;
      }
    }
  };
});
