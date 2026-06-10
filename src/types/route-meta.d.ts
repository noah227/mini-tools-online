import "vue-router"
import {TMetaRuntime} from "@/types/common";

declare module "vue-router" {
    interface RouteMeta extends TMetaRuntime{
        isTool?: Boolean
    }
}