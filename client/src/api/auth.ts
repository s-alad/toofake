function refresh(): void {
    console.log('refreshing token')
    if (localStorage.getItem('idtoken') != null) {
      if (Date.now() > parseInt(localStorage.getItem('expiration') ?? '0')) {
        console.log('in refresh')
        const rtok = localStorage.getItem('refresh');
        fetch(`/refresh/${rtok}`).then(
          (value) => {return value.json()}
        ).then(
          (data) => {
            localStorage.setItem('refresh', data['refresh_token'])
            localStorage.setItem('idtoken', data['id_token'])
            localStorage.setItem('expiration', (Date.now() + parseInt(data['expires_in'])).toString())
          }
        )

        console.log('refreshing token')
      }
  }
}


export {refresh}