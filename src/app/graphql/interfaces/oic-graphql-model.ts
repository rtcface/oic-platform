import { Observable } from "rxjs";
import { ente } from "./graphql-model";

export interface GraphqlService {

  getEntes():Observable<ente[]>;

  getNamesEntes():Observable<string[]>;


}