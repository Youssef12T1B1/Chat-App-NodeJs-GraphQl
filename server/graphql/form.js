const FromStuff = form =>{
    return {
        ...form.toJSON(),
                createdAt : new Date(form.createdAt).toISOString()
                
    }}


exports.FromStuff = FromStuff 