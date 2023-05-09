import * as React from "react";
import styles from "./TimeZone.module.scss";
import getSP from "../PnPjsConfig";
import { ITimeZoneProps } from "./ITimeZoneProps";
import { ITimeZoneState } from "./ITimeZoneState";
import * as moment from "moment-timezone";

export default class TimeZone extends React.Component<
  ITimeZoneProps,
  ITimeZoneState
> {
  sp = getSP(this.props.context);
  dec = moment(new Date());
  constructor(props: ITimeZoneProps) {
    super(props);
    this.state = {
      IsLoading: false,
      isNight: false,
      TimeZones: [
        {
          DisplayName:
            "Asia/Tel_Aviv".split("/")[1].replace(/_/g, " ") +
            ", " +
            "Asia/Tel_Aviv".split("/")[0],
          name: "Asia/Tel_Aviv",
          Date: moment().tz("Asia/Tel_Aviv").format("dddd, MMM DD YYYY"),
          Time: moment().tz("Asia/Tel_Aviv").format("hh:mm"),
          AmPm: moment().tz("Asia/Tel_Aviv").format("A"),
          Behind: null,
        },
        {
          DisplayName:
            "America/New_York".split("/")[1].replace(/_/g, " ") +
            ", " +
            "America/New_York".split("/")[0],
          name: "America/New_York",
          Date: moment().tz("America/New_York").format("dddd, MMM DD YYYY"),
          Time: moment().tz("America/New_York").format("hh:mm"),
          AmPm: moment().tz("America/New_York").format("A"),
          Behind: null,
        },
        {
          DisplayName:
            "America/Chicago".split("/")[1].replace(/_/g, " ") +
            ", " +
            "America/Chicago".split("/")[0],
          name: "America/Chicago",
          Date: moment().tz("America/Chicago").format("dddd, MMM DD YYYY"),
          Time: moment().tz("America/Chicago").format("hh:mm"),
          AmPm: moment().tz("America/Chicago").format("A"),
          Behind: null,
        },
        {
          DisplayName:
            "America/Denver".split("/")[1].replace(/_/g, " ") +
            ", " +
            "America/Denver".split("/")[0],
          name: "America/Denver",
          Date: moment().tz("America/Denver").format("dddd, MMM DD YYYY"),
          Time: moment().tz("America/Denver").format("hh:mm"),
          AmPm: moment().tz("America/Denver").format("A"),
          Behind: null,
        },
      ],
    };
  }

  //* Function to get the different timezones
  getHoursDiff(timezone: any) {
    const asiaTelAvivTime = moment().tz("Asia/Tel_Aviv");
    const americaNewYorkTime = moment().tz(timezone);
    const diffInHours =
      asiaTelAvivTime.utcOffset() / 60 - americaNewYorkTime.utcOffset() / 60;
    return diffInHours;
  }

  isNight = (timezone: any) => {
    const currentTime = moment().tz(timezone);
    //* Assuming sunrise is at 6:00 am
    const sunriseTime = moment().tz(timezone).startOf("day").add(6, "hours");
    //* Assuming sunset is at 18:00 pm
    const sunsetTime = moment().tz(timezone).startOf("day").add(18, "hours");

    if (currentTime.isAfter(sunsetTime) || currentTime.isBefore(sunriseTime)) {
      return true;
    } else {
      return false;
    }
  };

  componentDidMount() {
    //* Load timezones every 5 second.
    const intervalId = setInterval(() => {
      const tempTimeZone = JSON.parse(JSON.stringify(this.state.TimeZones));
      tempTimeZone.forEach((timezone: any) => {
        timezone.Date = moment().tz(timezone.name).format("dddd, MMM DD YYYY");
        timezone.Time = moment().tz(timezone.name).format("hh:mm");
        timezone.AmPm = moment().tz(timezone.name).format("A");
        timezone.Behind = this.getHoursDiff(timezone.name);
      });
      this.setState({
        TimeZones: tempTimeZone,
      });
    }, 1000);
    return () => clearInterval(intervalId);
  }

  public render(): React.ReactElement<ITimeZoneProps> {
    return (
      <div className={styles.TimeZoneContainer}>
        <div className={styles.MainTitle}>{this.props.Title}</div>
        {this.state.TimeZones.map((timezone: any) =>
          !this.props.checkboxIsraelTelAviv &&
          timezone.name === "Asia/Tel_Aviv" ? null : !this.props
              .checkboxAmericaNewYork &&
            timezone.name === "America/New_York" ? null : !this.props
              .checkboxAmericaChicago &&
            timezone.name === "America/Chicago" ? null : !this.props
              .checkboxAmericaDenver &&
            timezone.name === "America/Denver" ? null : (
            <div
              className={
                this.isNight(timezone.name)
                  ? styles.NightImage
                  : styles.DayImage
              }
            >
              <div key={timezone.name} className={styles.TextOver}>
                {timezone.DisplayName}
                <br />
                <div className={styles.HoursText}>
                  <div className={styles.Hours}>{timezone.Time}</div>
                  <div className={styles.AmPmText}>{timezone.AmPm}</div>
                  <div className={styles.DateText}>
                    {this.getHoursDiff(timezone.name) === 0
                      ? null
                      : this.getHoursDiff(timezone.name) + "h behind"}
                    <br />
                    {timezone.Date}
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    );
  }
}
