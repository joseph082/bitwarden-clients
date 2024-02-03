import { Component, EventEmitter, HostBinding, HostListener, Input, Output } from "@angular/core";
import { Router } from "@angular/router";

import { Organization } from "@bitwarden/common/admin-console/models/domain/organization";
import { I18nService } from "@bitwarden/common/platform/abstractions/i18n.service";
import { CollectionView } from "@bitwarden/common/vault/models/view/collection.view";

import { GroupView } from "../../../admin-console/organizations/core";
import { CollectionAdminView } from "../../core/views/collection-admin.view";

import {
  convertToPermission,
  getPermissionList,
} from "./../../../admin-console/organizations/shared/components/access-selector/access-selector.models";
import { VaultItemEvent } from "./vault-item-event";
import { RowHeightClass } from "./vault-items.component";

@Component({
  selector: "tr[appVaultCollectionRow]",
  templateUrl: "vault-collection-row.component.html",
})
export class VaultCollectionRowComponent {
  protected RowHeightClass = RowHeightClass;

  @Input() disabled: boolean;
  @Input() collection: CollectionView;
  @Input() showOwner: boolean;
  @Input() showCollections: boolean;
  @Input() showGroups: boolean;
  @Input() canEditCollection: boolean;
  @Input() canDeleteCollection: boolean;
  @Input() organizations: Organization[];
  @Input() groups: GroupView[];
  @Input() showPermissionsColumn: boolean;

  @Output() onEvent = new EventEmitter<VaultItemEvent>();

  @Input() checked: boolean;
  @Output() checkedToggled = new EventEmitter<void>();

  constructor(
    private router: Router,
    private i18nService: I18nService,
  ) {}

  @HostBinding("class")
  get classes() {
    return [].concat(this.disabled ? [] : ["tw-cursor-pointer"]);
  }

  get collectionGroups() {
    if (!(this.collection instanceof CollectionAdminView)) {
      return [];
    }

    return this.collection.groups;
  }

  get organization() {
    return this.organizations.find((o) => o.id === this.collection.organizationId);
  }

  get permissionText() {
    if (!(this.collection as CollectionAdminView).assigned) {
      return "-";
    } else {
      const permissionList = getPermissionList(this.organization?.flexibleCollections);
      return this.i18nService.t(
        permissionList.find((p) => p.perm === convertToPermission(this.collection))?.labelId,
      );
    }
  }

  @HostListener("click")
  protected click() {
    // FIXME: Verify that this floating promise is intentional. If it is, add an explanatory comment and ensure there is proper error handling.
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.router.navigate([], {
      queryParams: { collectionId: this.collection.id },
      queryParamsHandling: "merge",
    });
  }

  protected edit() {
    this.onEvent.next({ type: "editCollection", item: this.collection });
  }

  protected access() {
    this.onEvent.next({ type: "viewCollectionAccess", item: this.collection });
  }

  protected deleteCollection() {
    this.onEvent.next({ type: "delete", items: [{ collection: this.collection }] });
  }
}
