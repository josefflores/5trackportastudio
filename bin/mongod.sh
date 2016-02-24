#!/bin/bash
#   @file   mongodb.sh
#   Manages windows network service for the application

#   VARIABLES
MSG="[ MONGODB.SH ]"                    # output header
CONFIG="../ini/mongodb.conf"            # relative path to configuration file
declare -A CONFIG_ARR=()                # configuration array
IFS="="                                 # configuration separator
I=0                                     # parameter position

#   PARAMETER DEFAULTS
INSTALL=0                               # install the windows service
START=0                                 # start the windows service
STOP=0                                  # stop the windows service
RESTART=0                               # restart the windows service
CONFIRM=0                               # prompt for confirmation

#   FUNCTIONS

#   @name   start
#   start the mongodb service
#   @param  1   the service to start
function start {
    echo "${MSG} Starting service ${1}"
    net start ${1}
}

#   @name   stop
#   stops the mongodb service
#   @param  1   the service to stop
function stop {
    echo "${MSG} Stopping service ${1}"
    net stop ${1}
}

#   @name   restart
#   restarts the mongodb service
#   @param  1   the service to restart
function restart {
    echo "${MSG} Restarting service ${1}"
    stop $1
    start $1
}

#   @name   install
#   install and start the mongodb service
#   @param  1   the configuration file to use
#   @param  2   the service to install and start
function install {
    echo "${MSG} Installing service ${2}"
    mongod -f ${1} --install
    start $2
}

#   PARSE PARAMETERS
for I in "$@"
do
    case $I in
        --install|-i)
        INSTALL=1
        shift
        ;;
        --start|-s)
        START=1
        shift
        ;;
        --stop|-t)
        STOP=1
        shift
        ;;
        --restart|-r)
        RESTART=1
        shift
        ;;
        --confirm|-c)
        CONFIRM=1
        shift
        ;;
        *)
        echo "unknown option given"     # unknown option do nothing
        ;;
    esac
done

#   FIND ABSOLUTE PATH TO CONFIGURATION FILE
REL_PATH="`dirname \"$0\"`"
ABS_PATH="`( cd \"$REL_PATH\" && pwd )`"
CONFIG=${ABS_PATH}"/"${CONFIG}

#   EXTRACT CONFIG FILE KEY-PAIRS
while read -r KEY VAL; do
    CLEAN_KEY=$(echo $KEY | tr -d ' ')
    CLEAN_VAL=$(echo $VAL | sed -e 's/^[ \t]*//')
    CONFIG_ARR[$CLEAN_KEY]=${CLEAN_VAL}
done < ${CONFIG}

#   EXECUTE OPTIONS
if (( "${INSTALL}" == 1 )); then
    install ${CONFIG} ${CONFIG_ARR[serviceName]}
elif (( ( "${RESTART}" == 1 ) || ( "${START}" == 1 && "${STOP}" == 1 ) )); then
    restart ${CONFIG_ARR[serviceName]}
elif (( "${START}" == 1 )); then
    start ${CONFIG_ARR[serviceName]}
elif (( "${STOP}"  == 1 )); then
    stop ${CONFIG_ARR[serviceName]}
fi

#   TERMINATE
if (( ${CONFIRM} == 1 )); then
    read -n1 -r -p "${MSG} Press a key to continue..." tmp
fi
