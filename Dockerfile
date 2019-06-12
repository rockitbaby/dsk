# Copyright 2019 Atelier Disko. All rights reserved.
#
# Use of this source code is governed by a BSD-style
# license that can be found in the LICENSE file.

# Build stage to retrieve and build the frontend. Will pull in the frontend from
# the project root `frontend` folder. This stage hardcodes the build process for
# the built-in frontend. If you have a custom frontend with a different build
# process (although this one may work for you, as it's pretty standard), you'll
# need to create a new Dockerfile basing it off this one.
FROM alpine:latest as frontend

# Build stage to compile the DSK binary, "baking in" the frontend from the
# previous stage. The frontend will replace the default frontend.
FROM golang:1.12 as backend

ARG VERSION=head
ENV GO111MODULE=on

COPY . /src

WORKDIR /src

# We cannot compile our go program with C support, otherwise results in a "not
# found" error, when running the binary. This also disables DDT change watching
# and possibly other (future) features. However it is not expected that the former
# feature is of any use in secenarios we imagine the docker
# container is being run. Alternatively the tutorial at
# http://kefblog.com/2017-07-04/Golang-ang-docker can be used to enable CGO
# support.
ENV CGO_ENABLED=0 

# Build through Makefile, as it i.e. ensures the frontend embed happens
# correctly and uses the right defaults for Go modules.
RUN FRONTEND=/src/frontend VERSION=$VERSION make dist/dsk-linux-amd64

# Final stage that executes the binary.
FROM alpine:latest as run

# This cannot be called LANG, as it would override the original environment LANG
# variable that sets the system locale.
ENV DDT_LANG=en

COPY --from=backend /src/dist/dsk-linux-amd64 /dsk

EXPOSE 8080

CMD /dsk -lang $DDT_LANG -host 0.0.0.0 -port 8080 /ddt

