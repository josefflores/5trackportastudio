#!/bin/bash
#   @file   kex.sh
#   Terminates all instances of an executable on windows, made to deal with
#   hanging Node.JS instances on CygWin.

#   VARIABLES
MSG="[ KEX.SH ]"                        # output header
EXE=""
VAL=""

I=0                                     # parameter position

#   PARAMETER DEFAULTS
CONFIRM=0                               # prompt for confirmation

#   PARSE PARAMETERS
for I in "$@"
do
    case $I in
        --exe|-e)
        EXE=1
        VAL=$2
        shift
        ;;
        --confirm|-c)
        CONFIRM=1
        shift
        ;;
        *)
        echo "${MSG} Unknown option given"     # unknown option do nothing
        ;;
    esac
done

#   EXECUTE OPTIONS
if [ ! -z "$EXE" ]; then
    PID=$(ps -Wef | grep $VAL | awk '{print $2}')

    if [ -z "${PID}" ] ; then
        echo -e "${MSG} Nothing to terminate."
    else
        echo -e "${MSG} Terminating ${PID}."
    fi

    for P in $PID
    do
        RET=$(taskkill /F /PID $P)
        if [ $? ] ; then
            echo -e "${MSG} ${1} with PID ${P} was terminated."
        fi
    done
fi

#   TERMINATE
if (( ${CONFIRM} == 1 )); then
    read -n1 -r -p "${MSG} Press a key to continue..." tmp
fi
