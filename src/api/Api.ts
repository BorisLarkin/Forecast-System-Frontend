/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface DsForecastRequest {
  color: string;
  descr: string;
  ext_desc: string;
  image?: string;
  measure_type: string;
  short_title: string;
  title: string;
}

export interface DsForecastResponse {
  color: string;
  descr: string;
  ext_desc: string;
  forecast_id: number;
  image: string;
  measure_type: string;
  short_title: string;
  title: string;
}

export interface DsForecastResponseWithFlags {
  color: string;
  descr: string;
  ext_desc: string;
  forecast_id: number;
  image: string;
  input: string;
  measure_type: string;
  result: string;
  short_title: string;
  title: string;
}

export interface DsForecasts {
  color: string;
  descr: string;
  ext_desc: string;
  forecast_id: number;
  image?: string;
  measure_type: string;
  short_title: string;
  title: string;
}

export interface DsGetForecastsResponse {
  forecasts: DsForecasts[];
  forecasts_empty?: boolean;
  prediction_id: string;
  prediction_size: number;
}

export interface DsPredictionWithForecasts {
  forecasts: DsForecastResponseWithFlags[];
  prediction: DsPredictions;
}

export interface DsPredictions {
  date_completed?: string;
  date_created?: string;
  date_formed?: string;
  prediction_amount?: number;
  prediction_id?: number;
  prediction_window?: number;
  status?: string;
}

export interface DsPredsForecs {
  forecast?: DsForecasts;
  forecast_id: number;
  input?: string;
  prediction?: DsPredictions;
  prediction_id: number;
  preds_forecs_id: number;
  result?: string;
}

export enum DsRole {
  Guest = 0,
  User = 1,
  Moderator = 2,
}

export interface DsUpdatePredForecInput {
  input: string;
}

export interface HandlerEditPredReq {
  prediction_amount: number;
  prediction_window: number;
}

export interface HandlerLoginReq {
  guest: boolean;
  login: string;
  password: string;
}

export interface HandlerLoginResp {
  access_token: string;
  expires_in: string;
  login: string;
  role: number;
  token_type: string;
}

export interface HandlerRegisterReq {
  login: string;
  password: string;
}

export interface HandlerRegisterResp {
  ok: boolean;
}

export interface HandlerUpdateReq {
  login: string;
  password: string;
  role: DsRole;
}

export interface HandlerUpdateResp {
  login: string;
  role: DsRole;
  uid: string;
}

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "http://localhost:8080" });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Forecast system
 * @version 1.0
 * @license AS IS (NO WARRANTY)
 * @baseUrl http://localhost:8080
 * @contact API Support <borislarkin18@mail.ru> (https://vk.com/b.larkin)
 *
 * Bmstu Open IT Platform
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  forecast = {
    /**
     * @description very very friendly response
     *
     * @tags Forecasts
     * @name PostForecast
     * @summary Add forecast to the list
     * @request POST:/forecast/add
     */
    postForecast: (forecast: DsForecastRequest, params: RequestParams = {}) =>
      this.request<DsForecastRequest, DsForecasts>({
        path: `/forecast/add`,
        method: "POST",
        body: forecast,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description very very friendly response
     *
     * @tags Forecasts
     * @name DeleteDelete
     * @summary Delete a specified forecast by its ID
     * @request DELETE:/forecast/delete/{id}
     */
    deleteDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/forecast/delete/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * @description very very friendly response
     *
     * @tags Forecasts
     * @name EditUpdate
     * @summary Edit forecast
     * @request PUT:/forecast/edit/{id}
     */
    editUpdate: (id: number, forecast: DsForecastRequest, params: RequestParams = {}) =>
      this.request<DsForecastRequest, DsForecasts>({
        path: `/forecast/edit/${id}`,
        method: "PUT",
        body: forecast,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description If there`s no draft found, a new draft is to be created.
     *
     * @tags Preds_Forecs
     * @name ToPredCreate
     * @summary Add forecast to current user`s draft prediction
     * @request POST:/forecast/to_pred/{forecast_id}
     */
    toPredCreate: (forecastId: number, params: RequestParams = {}) =>
      this.request<DsPredictionWithForecasts, void>({
        path: `/forecast/to_pred/${forecastId}`,
        method: "POST",
        format: "json",
        ...params,
      }),

    /**
     * @description very very friendly response
     *
     * @tags Forecasts
     * @name ForecastDetail
     * @summary Get a specified forecast by its ID
     * @request GET:/forecast/{id}
     */
    forecastDetail: (id: number, params: RequestParams = {}) =>
      this.request<DsForecastResponse, void>({
        path: `/forecast/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description very very friendly response
     *
     * @tags Forecasts
     * @name AddPictureCreate
     * @summary Add image to specified forecast
     * @request POST:/forecast/{id}/add_picture
     */
    addPictureCreate: (
      id: number,
      data: {
        /** New image for the forecast */
        image: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/forecast/${id}/add_picture`,
        method: "POST",
        body: data,
        type: ContentType.FormData,
        ...params,
      }),
  };
  forecasts = {
    /**
     * @description very very friendly response
     *
     * @tags Forecasts
     * @name ForecastsList
     * @summary Show all available forecasts filtered by name
     * @request GET:/forecasts
     */
    forecastsList: (
      query?: {
        /** name filter */
        forecast_name?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<DsGetForecastsResponse, void>({
        path: `/forecasts`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
  };
  prFc = {
    /**
     * @description An error is returned in cases of unauthorized actions being attempted
     *
     * @tags Preds_Forecs
     * @name EditUpdate
     * @summary Edit forecast`s input data for specified prediction
     * @request PUT:/pr_fc/edit/{prediction_id}/{forecast_id}
     */
    editUpdate: (forecastId: number, predictionId: number, input: DsUpdatePredForecInput, params: RequestParams = {}) =>
      this.request<DsPredsForecs, void>({
        path: `/pr_fc/edit/${predictionId}/${forecastId}`,
        method: "PUT",
        body: input,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description An error is returned in cases of unauthorized actions being attempted
     *
     * @tags Preds_Forecs
     * @name RemoveDelete
     * @summary Delete forecast from specified prediction
     * @request DELETE:/pr_fc/remove/{prediction_id}/{forecast_id}
     */
    removeDelete: (forecastId: number, predictionId: number, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/pr_fc/remove/${predictionId}/${forecastId}`,
        method: "DELETE",
        ...params,
      }),
  };
  prediction = {
    /**
     * @description Method sets prediction`s status to "deleted" without actually removing it from the db model
     *
     * @tags Predictions
     * @name DeleteDelete
     * @summary Delete specified prediction
     * @request DELETE:/prediction/delete/{id}
     */
    deleteDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/prediction/delete/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * @description very very friendly response
     *
     * @tags Predictions
     * @name EditUpdate
     * @summary Edit specified prediction`s prediction amount & window
     * @request PUT:/prediction/edit/{id}
     */
    editUpdate: (id: number, prediction: HandlerEditPredReq, params: RequestParams = {}) =>
      this.request<DsPredictionWithForecasts, void>({
        path: `/prediction/edit/${id}`,
        method: "PUT",
        body: prediction,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Can be ended with statuses: ["denied", "completed"]
     *
     * @tags Predictions
     * @name FinishUpdate
     * @summary Finish specified prediction
     * @request PUT:/prediction/finish/{id}
     */
    finishUpdate: (
      id: number,
      query?: {
        /** Status to be set */
        status?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<DsPredictionWithForecasts, void>({
        path: `/prediction/finish/${id}`,
        method: "PUT",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description very very friendly response
     *
     * @tags Predictions
     * @name FormUpdate
     * @summary Form specified prediction
     * @request PUT:/prediction/form/{id}
     */
    formUpdate: (id: number, params: RequestParams = {}) =>
      this.request<DsPredictionWithForecasts, void>({
        path: `/prediction/form/${id}`,
        method: "PUT",
        format: "json",
        ...params,
      }),

    /**
     * @description very very friendly response
     *
     * @tags Predictions
     * @name PredictionDetail
     * @summary Display a prediction and its forecasts
     * @request GET:/prediction/{id}
     */
    predictionDetail: (id: number, params: RequestParams = {}) =>
      this.request<DsPredictionWithForecasts, void>({
        path: `/prediction/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
  predictions = {
    /**
     * @description very very friendly response
     *
     * @tags Predictions
     * @name PredictionsList
     * @summary Show all predictions made for current user
     * @request GET:/predictions
     */
    predictionsList: (
      query?: {
        /** Prediction status */
        status?: string;
        /** Earliest date created filter: YYYY-Mon-DD */
        start_date?: string;
        /** Latest date created filter: YYYY-Mon-DD */
        end_date?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<DsPredictions[], void>({
        path: `/predictions`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
  };
  user = {
    /**
     * @description very very friendly response
     *
     * @tags Users
     * @name LoginCreate
     * @summary Login the specified user
     * @request POST:/user/login
     */
    loginCreate: (user: HandlerLoginReq, params: RequestParams = {}) =>
      this.request<HandlerLoginResp, void>({
        path: `/user/login`,
        method: "POST",
        body: user,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description very very friendly response
     *
     * @tags Users
     * @name LogoutCreate
     * @summary Logout the current user
     * @request POST:/user/logout
     */
    logoutCreate: (params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/user/logout`,
        method: "POST",
        ...params,
      }),

    /**
     * @description very very friendly response
     *
     * @tags Users
     * @name RegisterCreate
     * @summary Register the specified user
     * @request POST:/user/register
     */
    registerCreate: (user: HandlerRegisterReq, params: RequestParams = {}) =>
      this.request<HandlerRegisterResp, void>({
        path: `/user/register`,
        method: "POST",
        body: user,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description very very friendly response
     *
     * @tags Users
     * @name UpdateUpdate
     * @summary Update the specified user
     * @request PUT:/user/update/{id}
     */
    updateUpdate: (id: number, user: HandlerUpdateReq, params: RequestParams = {}) =>
      this.request<HandlerUpdateResp, void>({
        path: `/user/update/${id}`,
        method: "PUT",
        body: user,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
