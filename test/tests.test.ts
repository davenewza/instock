import { jobs, models, resetDatabase } from "@teamkeel/testing"
import { test, expect, beforeEach } from "vitest";

beforeEach(resetDatabase);

test("create action - audit table populated", async () => {
    await models.warehouse.create({code: "CPT", name: "Cape Town"});
    await models.warehouse.create({code: "JHB", name: "Johannesburg"});

    await models.product.create({sku: "RL-AE086", title: "Arduino Ultimate UNO R3 Starter Kit"});
    await models.product.create({sku: "RL-AA076", title: "MB102 Breadboard Power Supply Module 3.3V/5V"});

    await jobs.stockTracker();

    await jobs.stockTracker();
    
    console.log(await models.stockLevels.findMany());
});