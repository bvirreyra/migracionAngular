import { TestBed } from "@angular/core/testing";

import { ArchivocentralService } from "./archivocentral.service";

describe("ArchivocentralService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: ArchivocentralService = TestBed.get(ArchivocentralService);
    expect(service).toBeTruthy();
  });
});
