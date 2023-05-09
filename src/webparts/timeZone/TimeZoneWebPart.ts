import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import { IReadonlyTheme } from "@microsoft/sp-component-base";
import { CalloutTriggers } from "@pnp/spfx-property-controls/lib/Callout";
import { PropertyFieldCheckboxWithCallout } from "@pnp/spfx-property-controls/lib/PropertyFieldCheckboxWithCallout";
import * as strings from "TimeZoneWebPartStrings";
import TimeZone from "./components/TimeZone";
import { ITimeZoneProps } from "./components/ITimeZoneProps";

export interface ITimeZoneWebPartProps {
  description: string;
  checkboxIsraelTelAviv: boolean;
  checkboxAmericaNewYork: boolean;
  checkboxAmericaChicago: boolean;
  checkboxAmericaDenver: boolean;
  Title: string;
}

export default class TimeZoneWebPart extends BaseClientSideWebPart<ITimeZoneWebPartProps> {
  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = "";

  public render(): void {
    const element: React.ReactElement<ITimeZoneProps> = React.createElement(
      TimeZone,
      {
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        Title: this.properties.Title,
        checkboxIsraelTelAviv: this.properties.checkboxIsraelTelAviv,
        checkboxAmericaNewYork: this.properties.checkboxAmericaNewYork,
        checkboxAmericaChicago: this.properties.checkboxAmericaChicago,
        checkboxAmericaDenver: this.properties.checkboxAmericaDenver,
        context: this.context,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    return this._getEnvironmentMessage().then((message) => {
      this._environmentMessage = message;
    });
  }

  private _getEnvironmentMessage(): Promise<string> {
    if (!!this.context.sdks.microsoftTeams) {
      // running in Teams, office.com or Outlook
      return this.context.sdks.microsoftTeams.teamsJs.app
        .getContext()
        .then((context) => {
          let environmentMessage: string = "";
          switch (context.app.host.name) {
            case "Office": // running in Office
              environmentMessage = this.context.isServedFromLocalhost
                ? strings.AppLocalEnvironmentOffice
                : strings.AppOfficeEnvironment;
              break;
            case "Outlook": // running in Outlook
              environmentMessage = this.context.isServedFromLocalhost
                ? strings.AppLocalEnvironmentOutlook
                : strings.AppOutlookEnvironment;
              break;
            case "Teams": // running in Teams
              environmentMessage = this.context.isServedFromLocalhost
                ? strings.AppLocalEnvironmentTeams
                : strings.AppTeamsTabEnvironment;
              break;
            default:
              throw new Error("Unknown host");
          }

          return environmentMessage;
        });
    }

    return Promise.resolve(
      this.context.isServedFromLocalhost
        ? strings.AppLocalEnvironmentSharePoint
        : strings.AppSharePointEnvironment
    );
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const { semanticColors } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty(
        "--bodyText",
        semanticColors.bodyText || null
      );
      this.domElement.style.setProperty("--link", semanticColors.link || null);
      this.domElement.style.setProperty(
        "--linkHovered",
        semanticColors.linkHovered || null
      );
    }
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription,
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField("Title", {
                  label: "Title field",
                }),
                PropertyFieldCheckboxWithCallout("checkboxIsraelTelAviv", {
                  calloutTrigger: CalloutTriggers.Click,
                  key: "checkboxWithCalloutFieldId",
                  calloutContent: React.createElement(
                    "p",
                    {},
                    "show/hide Tel-Aviv time zone"
                  ),
                  calloutWidth: 200,
                  text: "TelAviv, Israel",
                  checked: this.properties.checkboxIsraelTelAviv,
                }),
                PropertyFieldCheckboxWithCallout("checkboxAmericaNewYork", {
                  calloutTrigger: CalloutTriggers.Click,
                  key: "checkboxWithCalloutFieldId",
                  calloutContent: React.createElement(
                    "p",
                    {},
                    "show/hide New York time zone"
                  ),
                  calloutWidth: 200,
                  text: "New York, America",
                  checked: this.properties.checkboxAmericaNewYork,
                }),
                PropertyFieldCheckboxWithCallout("checkboxAmericaChicago", {
                  calloutTrigger: CalloutTriggers.Click,
                  key: "checkboxWithCalloutFieldId",
                  calloutContent: React.createElement(
                    "p",
                    {},
                    "show/hide Chicago time zone"
                  ),
                  calloutWidth: 200,
                  text: "Chicago, America",
                  checked: this.properties.checkboxAmericaChicago,
                }),
                PropertyFieldCheckboxWithCallout("checkboxAmericaDenver", {
                  calloutTrigger: CalloutTriggers.Click,
                  key: "checkboxWithCalloutFieldId",
                  calloutContent: React.createElement(
                    "p",
                    {},
                    "show/hide Denver time zone"
                  ),
                  calloutWidth: 200,
                  text: "Denver, America",
                  checked: this.properties.checkboxAmericaDenver,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
