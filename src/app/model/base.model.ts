/**
 * © Rolling Array https://rollingarray.co.in/
 *
 *
 * @summary Base Model
 * @author code@rollingarray.co.in
 *
 * Created at     : 2021-04-29 11:19:35 
 * Last modified  : 2023-04-01 13:33:24
 */

import { ErrorModel } from "./error.model";
import { OperatingUserModel } from "./operating-user.model";


export interface BaseModel extends OperatingUserModel
{
	success?: boolean;
	error?: ErrorModel;
}
