----------------------------------------------
1. Install on Tomcat with Backend Web Services

1.1. Install HELM2MonomerService ( HELM2MonomerService.war )

Download the war file from this URL: https://github.com/PistoiaHELM/HELMMonomerService/releases/download/0.0.4/HELM2MonomerService.war
Copy the war file int0 this folder on Tomcat server: C:\Program Files\Apache Software Foundation\Tomcat 9.0\webapps\


1.2 Install HELM2WebService ( WebService.war )

Download the war file from this URL: http://54.91.164.146/HELM2MonomerService/hwe/WebService.war (temporary link)
Copy the war file int0 this folder on Tomcat server: C:\Program Files\Apache Software Foundation\Tomcat 9.0\webapps\


1.3 Install HELMWebEditor ( hwe-1.1.0.zip )

Download the zip file from this URL: https://github.com/PistoiaHELM/HELMWebEditor/releases/download/1.1.0/hwe-1.1.0.zip
Unzip it can copy the *hwe* folder to this folder on Tomcat server: C:\Program Files\Apache Software Foundation\Tomcat 9.0\webapps\HELM2MonomerService\


Verification:
There will be two folders in this folder C:\Program Files\Apache Software Foundation\Tomcat 9.0\webapps\
- HELM2MonomerService
- WebService


Run HELM Web Editor
Load this url from the browser: http://SERVER/HELM2MonomerService/hwe/



-----------------------------------------------------
2. Install on IIS/Tomcat without Backend Web Services

Download the zip file from this URL: https://github.com/PistoiaHELM/HELMWebEditor/releases/download/1.1.0/hwe-iis-1.1.0.zip
Unzip it can copy the *hwe* folder to this folder on IIS Server: C:\inetpub\wwwroot\


Run HELM Web Editor
Load this url from the browser: http://SERVER/hwe/
