import send from '@polka/send-type';

export async function post(req, res) {
    if(
        !req.session
    ){
        send(res, 401, "Unauthorized<br/>Log <em>in</em> before you try to log <em>out</em>.")
    }

    try {
        req.session.destroy();
        send(res, 200)
    } catch (error) {
        send(res, 500, error)
    }
  }
