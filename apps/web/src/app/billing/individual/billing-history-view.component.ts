import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { ApiService } from "@bitwarden/common/abstractions/api.service";
import { BillingHistoryResponse } from "@bitwarden/common/billing/models/response/billing-history.response";
import { PlatformUtilsService } from "@bitwarden/common/platform/abstractions/platform-utils.service";

@Component({
  templateUrl: "billing-history-view.component.html",
})
export class BillingHistoryViewComponent implements OnInit {
  loading = false;
  firstLoaded = false;
  billing: BillingHistoryResponse;

  constructor(
    private apiService: ApiService,
    private platformUtilsService: PlatformUtilsService,
    private router: Router,
  ) {}

  async ngOnInit() {
    if (this.platformUtilsService.isSelfHost()) {
      // FIXME: Verify that this floating promise is intentional. If it is, add an explanatory comment and ensure there is proper error handling.
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.router.navigate(["/settings/subscription"]);
      return;
    }
    await this.load();
    this.firstLoaded = true;
  }

  async load() {
    if (this.loading) {
      return;
    }
    this.loading = true;
    this.billing = await this.apiService.getUserBillingHistory();
    this.loading = false;
  }
}
