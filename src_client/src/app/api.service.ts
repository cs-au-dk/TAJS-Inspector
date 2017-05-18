import {Injectable} from "@angular/core";
import {Http, URLSearchParams} from "@angular/http";
import {environment} from "../environments/environment";
import {ToastyService} from "ng2-toasty";

@Injectable()
export class ApiService {
  apiUrl = environment.apiUrl;

  constructor(private http: Http,
              private toastyService: ToastyService) {
  }

  getOptionData(): Promise<OptionData> {
    return this.http.get(this.apiUrl + '/info')
      .toPromise()
      .then((response: any) => response.json())
      .catch(this.handleError);
  }

  getGutters(fileID: FileID): Promise<Gutter<any>[]> {
    let params = new URLSearchParams();
    params.set('fileID', fileID.toString());

    return this.http.get(this.apiUrl + '/gutters', {search: params})
      .toPromise()
      .then((response: any) => response.json())
      .catch(this.handleError);
  }

  getLineValues(file: FileID, line: number): Promise<LineValue[]> {
    let params = new URLSearchParams();
    params.set('fileID', file.toString());
    params.set('line', line.toString());

    return this.http.get(this.apiUrl + '/line-values', {search: params})
      .toPromise()
      .then((response: any) => response.json())
      .catch(this.handleError);
  }

  getFileDescription(fileID: FileID): Promise<FileDescription> {
    let params = new URLSearchParams();
    params.set('fileID', fileID.toString());

    return this.http.get(this.apiUrl + '/file', {search: params})
      .toPromise()
      .then((response: any) => response.json())
      .catch(this.handleError);
  }

  getFileIDs(): Promise<FileID[]> {
    return this.http.get(this.apiUrl + '/files')
      .toPromise()
      .then((response: any) => response.json())
      .catch(this.handleError);
  }

  getAllocationLocations(objectID: ObjectID): Promise<ContextSensitiveDescribedLocation[]> {
    let params = new URLSearchParams();
    params.set('objectID', objectID.toString());

    return this.http.get(this.apiUrl + '/allocation-locations', {search: params})
      .toPromise()
      .then((response: any) => response.json())
      .catch(this.handleError);
  }

  getCallLocations(objectID: ObjectID): Promise<ContextSensitiveDescribedLocation[]> {
    let params = new URLSearchParams();
    params.set('objectID', objectID.toString());

    return this.http.get(this.apiUrl + '/call-locations', {search: params})
      .toPromise()
      .then((response: any) => response.json())
      .catch(this.handleError);
  }

  getEventHandlerRegistrationLocations(objectID: ObjectID): Promise<ContextSensitiveDescribedLocation[]> {
    let params = new URLSearchParams();
    params.set('objectID', objectID.toString());

    return this.http.get(this.apiUrl + '/event-handler-registration-locations', {search: params})
      .toPromise()
      .then((response: any) => response.json())
      .catch(this.handleError);
  }

  getRelatedLocation(locationID: LocationID, forwards: boolean, kind: RelatedLocationKind, intraprocedural: boolean): Promise<DescribedLocation[]> {
    let params = new URLSearchParams();
    params.set('locationID', locationID.toString());
    params.set('forwards', forwards.toString());
    params.set('kind', kind);
    params.set('intraprocedural', intraprocedural.toString());

    return this.http.get(this.apiUrl + '/related-locations', {search: params})
      .toPromise()
      .then((response: any) => response.json())
      .catch(this.handleError);
  }

  getPositionalLocationID(fileID: FileID, line: number, column: number, contextID?: ContextID): Promise<Optional<DescribedLocation>> {
    let params = new URLSearchParams();
    params.set('fileID', fileID.toString());
    params.set('line', line.toString());
    params.set('column', column.toString());
    if (contextID) params.set('contextID', contextID.toString());

    return this.http.get(this.apiUrl + '/positional-location-id', {search: params})
      .toPromise()
      .then((response: any) => response.json())
      .catch(this.handleError);
  }

  getEnclosingFunction(locationID: LocationID): Promise<ObjectID[]> {
    let params = new URLSearchParams();
    params.set('locationID', locationID.toString());

    return this.http.get(this.apiUrl + '/enclosing-function', {search: params})
      .toPromise()
      .then((response: any) => response.json())
      .catch(this.handleError);
  }

  getObjectProperties(objectID: ObjectID, locationID: LocationID): Promise<DescribedProperties> {
    let params = new URLSearchParams();
    params.set('objectID', objectID.toString());
    params.set('locationID', locationID.toString());

    return this.http.get(this.apiUrl + '/object-properties', {search: params})
      .toPromise()
      .then((response: any) => response.json())
      .catch(this.handleError);
  }

  getFilteredContexts(locationID: LocationID, expression: string): Promise<DescribedContext[]> {
    let params = new URLSearchParams();
    params.set('locationID', locationID.toString());
    params.set('expression', expression);

    return this.http.get(this.apiUrl + '/filter-contexts', {search: params})
      .toPromise()
      .then((response: any) => response.json())
      .catch(this.handleError);
  }

  handleError(error: any): Promise<any> {
    console.log(error);
    return Promise.reject(error.message || error);
  }

}
