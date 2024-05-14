import { Component, OnInit } from "@angular/core";
import { VersionCheckService } from "./version-check.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  providers: [VersionCheckService],
})
export class AppComponent implements OnInit {
  constructor(private versionCheckService: VersionCheckService) {}
  title = "my-proyecto-angular";
  ngOnInit() {
    //this.versionCheckService.initVersionCheck(environment.versionCheckURL);
  }
}
