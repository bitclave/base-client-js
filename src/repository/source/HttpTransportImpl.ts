export default class JrpcTransport implements HttpTransport {

    sendRequest<T>(method: string, data: Object, clazz: {new(): T; }): Promise<T> {
        return resolve()
            const requestApi = `/advert/?request=${request}&page=${page}&pagesize=${size}`;

            return fetch(requestApi)
                .then((response) => Object.assign(new clazz(), response.json()));
        });
    }

}
