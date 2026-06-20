---
sidebar_position: 2
---
# metainfo.xml

Manifest metadata and package identity.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<MetaInformation>
  <Attribute id="Package:ID"      value="com.yourname.scriptname"/> <!-- required for simple command-only packages -->
  <Attribute id="Package:Name"    value="Display Name"/>             <!-- optional metadata -->
  <Attribute id="Package:Version" value="1.0.0"/>                    <!-- optional metadata -->
  <Attribute id="Package:Vendor"  value="Your Name"/>                <!-- optional metadata -->
  <Attribute id="Package:Email"   value="you@example.com"/>          <!-- optional metadata -->
  <Attribute id="Package:SkinFile" value="skin/"/>                   <!-- required when using skin.xml dialogs -->
</MetaInformation>
```