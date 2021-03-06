# Builtin DSK Frontend

This is the frontend being used by default by DSK. 

We build it using vanilla JavaScript utilizing modern web technologies, so
that first the code can be understood without expert knowledge of specific
frameworks, libraries or (sometimes very complicated) transpilation processes.
We hope that custom frontend authors find the code a good kind of documentation
when building their own. Second, we want to test how far vanilly JavaScript and
web technologies today can take us.

The frontend interacts with the DSK backend using its HTTP API. It accesses
that API via the `Client` JavaScript class from the DSK JavaScript module in
`js/dsk`. The DSK JavaScript module contains other usefull utilities, like
`Tree`, that help with traversing and filtering tree, i.e. for the filter
navigation.

## Requirements

DSK APIv2 and a browser that supports ES6.

## Copyright & License

DSK is Copyright (c) 2017 Atelier Disko if not otherwise stated. Use of the
source code is governed by a BSD-style license that can be found in the LICENSE
file.


