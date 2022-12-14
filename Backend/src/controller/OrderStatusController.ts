import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {validate} from "class-validator";
import {Err, ErrStr, HttpCode} from "../helper/Err";
import {OrderStatus} from "../entity/OrderStatus";

// 任何controller都包括crud，增删改查
export class OrderStatusController {

    public static get repo() {
        return getRepository(OrderStatus)
    }

    static async all(request: Request, response: Response, next: NextFunction) {
        let orderStatus = []
        try {
            orderStatus = await OrderStatusController.repo.find()
        } catch (e) {
            console.log('error, write to db', e)
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }
        return response.status(200).send(new Err(HttpCode.E200, ErrStr.OK, orderStatus))
    }


    static async one(request: Request, response: Response, next: NextFunction) {
        const {orderId} = request.params
        if(!orderId) {
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrMissingParameter))
        }
        let order = null
        try {
            order = await OrderStatusController.repo.findOneOrFail(orderId)
        } catch (e) {
            console.log('error, write to db', e)
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }
        return response.status(200).send(new Err(HttpCode.E200, ErrStr.OK, order))
    }


    static async create(request: Request, response: Response, next: NextFunction) {
        let orderStatus = new OrderStatus()

        try {
            const errors = await validate(orderStatus);
            if (errors.length > 0) {
                let err = new Err(HttpCode.E400, ErrStr.ErrMissingParameter)
                return response.status(400).send(err)
            }

            //save data to DB
            await OrderStatusController.repo.save(orderStatus)

        } catch (e) {
            console.log('error, write to DB', e);
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }

        return response.status(200).send(new Err(HttpCode.E200, ErrStr.OK, orderStatus))
    }


    static async delete(request: Request, response: Response, next: NextFunction) {
        const { orderStatusId } = request.params;
        if (!orderStatusId) {
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrMissingParameter));
        }


        let orderStatus = null;
        try {
            orderStatus = await OrderStatusController.repo.findOneOrFail(orderStatusId);
        } catch(e) {
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrNoObj, e));
        }

        try {
            await OrderStatusController.repo.delete(orderStatusId);
        } catch(e) {
            console.log('error, write to DB', e);
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e));
        }

        return response.status(200).send(new Err(HttpCode.E200, ErrStr.OK));

    }


    static async update(request: Request, response: Response, next: NextFunction) {
    }

}