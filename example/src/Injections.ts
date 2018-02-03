import getDecorators from 'inversify-inject-decorators';
import { Container } from 'inversify';
import 'reflect-metadata';
import BaseManager from './manager/BaseManager';

let kernel = new Container();
kernel.bind<BaseManager>(BaseManager).to(BaseManager).inSingletonScope();

let {
    lazyInject,
    lazyInjectNamed,
    lazyInjectTagged,
    lazyMultiInject
} = getDecorators(kernel);

export {
    kernel,
    lazyInject,
    lazyInjectNamed,
    lazyInjectTagged,
    lazyMultiInject
};
