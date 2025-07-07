*** Settings ***
Library         String
Resource        ../utils/browser.robot

Suite Setup     Open Application    ${ADMIN_HOST}

Test Tags       e2e basic

*** Test Cases ***
Basic Test
    # Take Screenshot
    Delete All Cookies
    ${result}=  Get Text    css=#admin-login p
    Should Be Equal     ${result}   TO ACCESS THE ADMIN SECTION PLEASE


