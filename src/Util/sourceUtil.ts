import type { Source } from "./types";

export namespace sourceUtil{

    export function getBucketlessSources(sources: Source[]){
        return sources.filter(s => s.bucketTargetId == "")
    }
    export function getSourcesForIncomeSource(sources: Source[], incomeSourceId: string){
        return sources.filter(s => s.incomeSourceId == incomeSourceId)
    }
}